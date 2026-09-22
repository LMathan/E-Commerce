import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const { productId, rating, title, content } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Product ID and a valid rating (1-5) are required" }, { status: 400 });
    }

    // Check review moderation setting
    const moderationSetting = await prisma.siteSettings.findUnique({
      where: { key: "review_moderation" },
    });
    const requiresModeration = moderationSetting?.value === "true";

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title: title || null,
        body: content || title || "Great product!",
        status: requiresModeration ? "PENDING" : "APPROVED",
      },
    });

    return NextResponse.json({
      success: true,
      message: requiresModeration
        ? "Thank you! Your review has been submitted for moderation."
        : "Thank you! Your review has been posted.",
      review,
    });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

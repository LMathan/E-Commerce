import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Name, valid email, and password (min 6 characters) are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        status: "ACTIVE",
      },
    });

    // Assign CUSTOMER role
    const customerRole = await prisma.role.findUnique({
      where: { name: "CUSTOMER" },
    });

    if (customerRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: customerRole.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now log in.",
    });
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

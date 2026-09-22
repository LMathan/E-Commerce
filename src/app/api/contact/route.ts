import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save ticket in DB
    const ticket = await prisma.supportTicket.create({
      data: {
        guestEmail: email,
        subject: subject || `Inquiry from ${name}`,
        status: "OPEN",
        category: "GENERAL",
        messages: {
          create: {
            body: message,
            isAdmin: false,
          },
        },
      },
    });

    return NextResponse.json({ success: true, ticketId: ticket.id });
  } catch (error: any) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const { storeName, storeEmail, announcementText, announcementEnabled } = await request.json();

    const updates = [
      { key: "store_name", value: storeName || "LuxeShop", type: "string", group: "general" },
      { key: "store_email", value: storeEmail || "store@luxeshop.com", type: "string", group: "general" },
      { key: "announcement_bar_text", value: announcementText || "", type: "string", group: "content" },
      { key: "announcement_bar_enabled", value: String(announcementEnabled), type: "boolean", group: "content" },
    ];

    for (const setting of updates) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error: any) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

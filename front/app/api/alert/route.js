import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    let { deviceCode } = await req.json();

    // ✅ ลบช่องว่างหน้า-หลัง และแปลงเป็น lowercase เพื่อให้ match ได้แน่นอน
    deviceCode = deviceCode?.trim().toLowerCase();

    if (!deviceCode) {
      return NextResponse.json({ error: "Missing deviceCode" }, { status: 400 });
    }

    const noti = await prisma.noti.findUnique({
      where: { deviceCode },
      include: { user: true },
    });

    if (!noti) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    await sendEmail(
      noti.user.email,
      "🚨 แจ้งเตือนจากอุปกรณ์กันขโมย",
      `อุปกรณ์ "${noti.deviceName}" ตรวจพบการเคลื่อนไหว!\nตำแหน่ง: ${
        noti.location || "-"
      }\nรหัสเครื่อง: ${noti.deviceCode}`
    );

    return NextResponse.json({ message: "Alert sent successfully" });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

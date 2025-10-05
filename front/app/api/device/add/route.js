import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: userId } = verifyToken(token);

    const { deviceName, location } = await req.json();
    const deviceCode = randomUUID().split("-")[0];

    const noti = await prisma.noti.create({
      data: { userId, deviceName, deviceCode, location },
    });

    return NextResponse.json({ message: "Device added", noti });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

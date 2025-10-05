import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: userId } = verifyToken(token);

  const { deviceCode } = await req.json();
  await prisma.noti.deleteMany({ where: { userId, deviceCode } });
  return NextResponse.json({ message: "Device removed" });
}

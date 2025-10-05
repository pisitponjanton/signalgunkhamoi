import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashPassword(password) },
    });

    const token = signToken(user);
    const res = NextResponse.json({ message: "Signup success", user });
    res.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

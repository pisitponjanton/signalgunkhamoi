import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken(user);
  const res = NextResponse.json({ message: "Login success", user });
  res.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
  return res;
}

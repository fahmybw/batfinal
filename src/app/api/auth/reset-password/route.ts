import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const fd = await req.formData();
  const token = String(fd.get("token") || "");
  const password = String(fd.get("password") || "");
  const rec = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!rec || rec.usedAt || rec.expiresAt < new Date()) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  await prisma.user.update({ where: { id: rec.userId }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  await prisma.passwordResetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
  return NextResponse.json({ ok: true });
}

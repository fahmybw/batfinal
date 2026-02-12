import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const fd = await req.formData();
  const email = String(fd.get("email") || "").toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(24).toString("hex");
    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    await sendEmail(email, "Reset your BAT password", url);
  }
  return NextResponse.json({ ok: true });
}

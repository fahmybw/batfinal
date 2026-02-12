import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const fd = await req.formData();
  const email = String(fd.get("email") || "").toLowerCase();
  const password = String(fd.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email }, include: { memberships: true } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const workspaceId = user.memberships[0]?.workspaceId;
  if (!workspaceId) return NextResponse.json({ error: "No workspace" }, { status: 400 });
  const sessionToken = await createSession(user.id, workspaceId);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.twoFactorChallenge.create({
    data: { userId: user.id, sessionToken, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });
  await sendEmail(user.email, "Your BAT 2FA code", `Code: ${code}`);
  return NextResponse.json({ ok: true });
}

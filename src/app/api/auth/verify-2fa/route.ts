import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const token = cookies().get(process.env.SESSION_COOKIE_NAME ?? "bat_session")?.value;
  if (!token) return NextResponse.json({ error: "No session" }, { status: 401 });
  const fd = await req.formData();
  const code = String(fd.get("code") || "");
  const challenge = await prisma.twoFactorChallenge.findFirst({
    where: { sessionToken: token, code, usedAt: null, expiresAt: { gt: new Date() } }
  });
  if (!challenge) return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  await prisma.twoFactorChallenge.update({ where: { id: challenge.id }, data: { usedAt: new Date() } });
  await prisma.session.updateMany({ where: { token }, data: { twoFactorVerified: true } });
  cookies().set("bat_2fa", "verified", { httpOnly: true, sameSite: "lax", path: "/" });
  return NextResponse.json({ ok: true });
}

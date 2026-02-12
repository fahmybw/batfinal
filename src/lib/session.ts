import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export async function createSession(userId: string, workspaceId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const ttlHours = Number(process.env.SESSION_TTL_HOURS ?? "168");
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  await prisma.session.create({ data: { token, userId, workspaceId, expiresAt } });
  cookies().set(process.env.SESSION_COOKIE_NAME ?? "bat_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  return token;
}

export async function getSession() {
  const token = cookies().get(process.env.SESSION_COOKIE_NAME ?? "bat_session")?.value;
  if (!token) return null;
  return prisma.session.findUnique({ where: { token } });
}

export async function requireSession() {
  const session = await getSession();
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

export async function signOut() {
  const token = cookies().get(process.env.SESSION_COOKIE_NAME ?? "bat_session")?.value;
  if (token) await prisma.session.deleteMany({ where: { token } });
  cookies().delete(process.env.SESSION_COOKIE_NAME ?? "bat_session");
}

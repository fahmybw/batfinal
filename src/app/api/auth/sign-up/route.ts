import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const fd = await req.formData();
  const name = String(fd.get("name") || "");
  const email = String(fd.get("email") || "").toLowerCase();
  const password = String(fd.get("password") || "");
  if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name: name || "User", email, passwordHash } });
  const workspace = await prisma.workspace.create({ data: { name: `${user.name}'s Workspace` } });
  await prisma.workspaceMember.create({ data: { userId: user.id, workspaceId: workspace.id } });
  return NextResponse.json({ ok: true });
}

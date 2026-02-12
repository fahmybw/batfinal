import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { retrieveChunks } from "@/lib/retrieval";
import { generateChatReply } from "@/lib/ai";

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let thread = await prisma.chatThread.findFirst({ where: { workspaceId: session.workspaceId }, orderBy: { createdAt: "desc" }, include: { messages: true } });
  if (!thread) thread = await prisma.chatThread.create({ data: { workspaceId: session.workspaceId, title: "New Thread" }, include: { messages: true } });
  return NextResponse.json({ threadId: thread.id, messages: thread.messages });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const threadId = String(fd.get("threadId") || "");
  const message = String(fd.get("message") || "");
  await prisma.chatMessage.create({ data: { threadId, userId: session.userId, role: "USER", content: message } });
  const chunks = await retrieveChunks(session.workspaceId, message);
  const citations = chunks.map(c => ({ sourceName: c.sourceName, createdAt: c.createdAt.toISOString() }));
  const reply = await generateChatReply(message, chunks.map(c => c.content).join("\n"), citations);
  await prisma.chatMessage.create({ data: { threadId, role: "ASSISTANT", content: reply, citations } });
  const messages = await prisma.chatMessage.findMany({ where: { threadId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ messages });
}

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { chunkText } from "@/lib/utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sources = await prisma.dataSource.findMany({ where: { workspaceId: session.workspaceId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ sources });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const type = String(fd.get("type") || "NOTE") as any;
  const name = String(fd.get("name") || "Untitled Source");
  const content = String(fd.get("content") || "");
  const source = await prisma.dataSource.create({ data: { workspaceId: session.workspaceId, type, name, rawContent: content, sourceUrl: type === "URL" ? content : null } });
  const chunks = chunkText(content).map((chunk) => ({ workspaceId: session.workspaceId, dataSourceId: source.id, sourceName: name, content: chunk }));
  await prisma.documentChunk.createMany({ data: chunks });
  return NextResponse.json({ source });
}

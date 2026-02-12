import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { chunkText } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const sourceId = String(fd.get("sourceId") || "");
  const source = await prisma.dataSource.findUnique({ where: { id: sourceId } });
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let content = source.rawContent;
  if (source.type === "URL" && source.sourceUrl) {
    const html = await fetch(source.sourceUrl).then((r) => r.text()).catch(() => source.rawContent);
    content = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 15000);
  }

  await prisma.documentChunk.deleteMany({ where: { dataSourceId: source.id } });
  await prisma.documentChunk.createMany({
    data: chunkText(content).map((c) => ({ workspaceId: session.workspaceId, dataSourceId: source.id, sourceName: source.name, content: c }))
  });

  return NextResponse.json({ ok: true });
}

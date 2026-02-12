import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { retrieveChunks } from "@/lib/retrieval";
import { generateWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const channel = String(fd.get("channel") || "X") as any;
  const purpose = String(fd.get("purpose") || "awareness");
  const postType = String(fd.get("postType") || "post");
  const tone = String(fd.get("tone") || "neutral");
  const constraints = String(fd.get("constraints") || "");
  const memory = (await retrieveChunks(session.workspaceId, purpose)).map((c) => c.content).join("\n");
  const text = await generateWithFallback(`Generate JSON with hook, caption/script, hashtags, CTA, suggestedVisuals, altText, metadata for ${channel}. tone:${tone}. constraints:${constraints}. memory:${memory}`);
  const payload = { hook: "", "caption/script": text, hashtags: ["#bat"], CTA: "Book a demo", suggestedVisuals: "Clean UI", altText: "BAT preview", metadata: { channel, purpose, postType, tone } };
  const item = await prisma.contentItem.create({ data: { workspaceId: session.workspaceId, title: `${channel} ${purpose}`, channel, purpose, postType, tone, constraints } });
  const version = await prisma.contentVersion.create({ data: { contentItemId: item.id, version: 1, payload } });
  return NextResponse.json({ item, version });
}

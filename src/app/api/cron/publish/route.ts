import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function postAdapter(channel: string, payload: unknown) {
  return { ok: true, message: `Stub posted to ${channel}`, payload };
}

export async function GET(req: Request) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const due = await prisma.scheduledPost.findMany({ where: { status: "SCHEDULED", scheduledFor: { lte: new Date() } } });
  for (const post of due) {
    const res = await postAdapter(post.channel, post.payload);
    await prisma.postLog.create({ data: { scheduledPostId: post.id, message: res.message, payload: res } });
    await prisma.scheduledPost.update({ where: { id: post.id }, data: { status: "POSTED", postedAt: new Date() } });
  }
  return NextResponse.json({ processed: due.length });
}

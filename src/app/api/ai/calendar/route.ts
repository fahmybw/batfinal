import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const goal = String(fd.get("goal") || "awareness");
  const channels = String(fd.get("channels") || "X").split(",").map((c) => c.trim()).filter(Boolean) as any[];
  const calendar = await prisma.contentCalendar.create({ data: { workspaceId: session.workspaceId, name: `Plan ${new Date().toLocaleDateString()}`, config: { goal, channels } } });
  const items = await Promise.all(channels.map((channel, idx) => prisma.calendarItem.create({ data: { calendarId: calendar.id, workspaceId: session.workspaceId, date: new Date(Date.now() + idx * 86400000), channel, brief: `${goal} post for ${channel}`, draftContent: { idea: `Educational ${channel} post` } } })));
  return NextResponse.json({ calendar, items });
}

import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const workflows = await prisma.workflow.findMany({ where: { workspaceId: session.workspaceId } });
  const runs = await prisma.workflowRun.findMany({ where: { workspaceId: session.workspaceId }, orderBy: { startedAt: "desc" }, take: 20 });
  return NextResponse.json({ workflows, runs });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const workflow = await prisma.workflow.create({
    data: {
      workspaceId: session.workspaceId,
      name: String(fd.get("name") || "Workflow"),
      scheduleType: String(fd.get("scheduleType") || "MANUAL") as any,
      sourceIds: String(fd.get("sourceIds") || "").split(",").filter(Boolean),
      enabled: true
    }
  });
  return NextResponse.json({ workflow });
}

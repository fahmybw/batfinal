import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const fd = await req.formData();
  const workflowId = String(fd.get("workflowId") || "");
  if (!workflowId) return NextResponse.json({ ok: false });
  const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } });
  if (!workflow) return NextResponse.json({ ok: false }, { status: 404 });
  const run = await prisma.workflowRun.create({ data: { workflowId, workspaceId: workflow.workspaceId, status: "SUCCESS", log: "Manual run completed", finishedAt: new Date() } });
  await prisma.workflow.update({ where: { id: workflowId }, data: { lastRunAt: new Date() } });
  return NextResponse.json({ run });
}

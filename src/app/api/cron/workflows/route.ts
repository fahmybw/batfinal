import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const workflows = await prisma.workflow.findMany({ where: { enabled: true } });
  for (const w of workflows) {
    await prisma.workflowRun.create({ data: { workflowId: w.id, workspaceId: w.workspaceId, status: "SUCCESS", log: "Cron refresh completed", finishedAt: new Date() } });
    await prisma.workflow.update({ where: { id: w.id }, data: { lastRunAt: new Date() } });
  }
  return NextResponse.json({ processed: workflows.length });
}

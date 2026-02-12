import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@bat.ai" },
    update: {},
    create: { name: "Demo User", email: "demo@bat.ai", passwordHash }
  });

  const workspace = await prisma.workspace.create({ data: { name: "Demo Workspace" } });
  await prisma.workspaceMember.create({ data: { userId: user.id, workspaceId: workspace.id } });

  const source = await prisma.dataSource.create({
    data: {
      workspaceId: workspace.id,
      name: "Demo Brand Notes",
      type: "NOTE",
      rawContent: "BAT helps agencies orchestrate content planning, generation, and scheduling."
    }
  });

  await prisma.documentChunk.create({
    data: {
      workspaceId: workspace.id,
      dataSourceId: source.id,
      sourceName: source.name,
      content: source.rawContent
    }
  });
}

main().finally(async () => prisma.$disconnect());

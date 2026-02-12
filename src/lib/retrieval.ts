import { prisma } from "@/lib/db";

export async function retrieveChunks(workspaceId: string, query: string) {
  const chunks = await prisma.documentChunk.findMany({
    where: { workspaceId, content: { contains: query.split(" ")[0] ?? "", mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 5
  });
  return chunks;
}

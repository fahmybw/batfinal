import OpenAI from "openai";

type Citation = { sourceName: string; createdAt: string };

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateWithFallback(prompt: string) {
  if (!client) return `Mock BAT output:\n\n${prompt.slice(0, 400)}`;
  const res = await client.responses.create({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", input: prompt });
  return res.output_text;
}

export async function generateChatReply(message: string, memory: string, citations: Citation[]) {
  const body = await generateWithFallback(`User message: ${message}\nMemory:\n${memory}\nRespond concisely with actionable advice.`);
  return `${body}\n\nSources:\n${citations.map((c) => `- ${c.sourceName} (${new Date(c.createdAt).toLocaleDateString()})`).join("\n")}`;
}

import { generateText } from "ai";
import { model } from "../lib/ai";

export async function classifyIntent(text: string) {
  const r = await generateText({
    model,
    system: "Classify intent: support | order | billing. Return one word.",
    prompt: text,
  });

  return r.text.trim().toLowerCase();
}

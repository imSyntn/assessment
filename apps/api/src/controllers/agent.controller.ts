import { Context } from "hono";

const map = {
  support: ["faq", "troubleshooting"],
  order: ["status", "tracking", "cancel"],
  billing: ["invoice", "refund"],
};

export const listAgents = (c: Context) => {
  return c.json({ data: ["support", "order", "billing"] });
};

export const agentCapabilities = (c: Context) => {
  const t = c.req.param("type");

  return c.json({ data: map[t as keyof typeof map] ?? [] });
};

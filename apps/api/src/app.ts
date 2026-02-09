import { serve } from "@hono/node-server";
import { Hono } from "hono";

export const app = new Hono();

app.get("/health", (c) => {
  return c.json({ ok: true });
});

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

serve({
  fetch: app.fetch,
  port: 3000,
});

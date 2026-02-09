import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/health", (c) => {
  return c.json({ ok: true });
});

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

export type AppType = typeof app;

serve({
  fetch: app.fetch,
  port: 3000,
});

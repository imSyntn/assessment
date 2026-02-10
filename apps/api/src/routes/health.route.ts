import { Hono } from "hono";

const healthRoute = new Hono();

healthRoute.get("/", (c) => {
  c.status(200);
  return c.json({ ok: true, message: "API is healthy" });
});

export { healthRoute };

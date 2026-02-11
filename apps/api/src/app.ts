import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoute, chatRoute, agentsRoute } from "./routes";
import { errorMiddleware } from "./middleware";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.route("/api/health", healthRoute);
app.route("/api/chat", chatRoute);
app.route("/api/agents", agentsRoute);

app.onError(errorMiddleware);

export type AppType = typeof app;

serve({
  fetch: app.fetch,
  port: 3000,
});

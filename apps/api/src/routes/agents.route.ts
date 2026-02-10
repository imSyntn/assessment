import { Hono } from "hono";

const agentsRoute = new Hono();

agentsRoute
  .get("/", (c) => {
    c.status(200);
    return c.json({ ok: true, message: "agents" });
  })
  .get("/:type/capabilities", (c) => {
    const type = c.req.param("type");
    c.status(200);
    return c.json({ ok: true, message: `capabilities of ${type}` });
  });

export { agentsRoute };

import { Hono } from "hono";

const chatRoute = new Hono();

chatRoute
  .get("/conversations", (c) => {
    c.status(200);
    return c.json({ ok: true, message: "conversations" });
  })
  .get("/conversations/:id", (c) => {
    const id = c.req.param("id");
    c.status(200);
    return c.json({ ok: true, message: `conversation ${id}` });
  })
  .delete("/conversations/:id", (c) => {
    const id = c.req.param("id");
    c.status(200);
    return c.json({ ok: true, message: `conversation ${id} delete.` });
  })
  .post("/messages", (c) => {
    c.status(200);
    return c.json({ ok: true, message: "messages post" });
  });

export { chatRoute };

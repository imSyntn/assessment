import { Context } from "hono";

export const errorMiddleware = (err: any, c: Context) => {
  console.error(err);
  const msg = err.message || "Server error.";
  const status = err.status || 500;
  return c.json({ msg }, status);
};

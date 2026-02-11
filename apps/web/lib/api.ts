import { hc } from "hono/client";
import type { AppType } from "@repo/api";

export const honoClient = hc<AppType>("http://localhost:3000/api/");

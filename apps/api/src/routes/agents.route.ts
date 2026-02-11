import { Hono } from "hono";
import { agentCapabilities, listAgents } from "../controllers";

const agentsRoute = new Hono();

agentsRoute.get("/", listAgents).get("/:type/capabilities", agentCapabilities);

export { agentsRoute };

import { Hono } from "hono";
import {
  createConversation,
  deleteConversations,
  getConversations,
  getConversationsById,
  postMessage,
} from "../controllers";

const chatRoute = new Hono();

chatRoute
  .get("/conversations", getConversations)
  .get("/conversations/new", createConversation)
  .get("/conversations/:id", getConversationsById)
  .delete("/conversations/:id", deleteConversations)
  .post("/messages", postMessage);

export { chatRoute };

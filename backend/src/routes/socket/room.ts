import express from "express";
import { routeHandlerExample } from "@/handlers/blend";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import { createProxyMiddleware } from "http-proxy-middleware";
import env from "@/constants/env";

const router = express.Router();
const wsProxy = createProxyMiddleware({
  target: env.RoomServiceURL,
  changeOrigin: true,
  ws: true,
  pathRewrite: { "^/room": "/socket.io" },
});
router.use(wsProxy);

export default router;

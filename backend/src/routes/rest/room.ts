import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import env from "@/constants/env";

const router = express.Router();
const httpProxy = createProxyMiddleware({
  target: env.RoomServiceURL,
  changeOrigin: true,
});

router.use(httpProxy);

export default router;

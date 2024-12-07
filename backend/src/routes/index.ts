import socket from "./socket";
import rest from "./rest";
import express from "express";

const router = express.Router();

router.use("/api", rest);
router.use("/socket.io", socket);

export default router;

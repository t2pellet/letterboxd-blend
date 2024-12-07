import express from "express";
import { getBlendHandler } from "@/handlers/blend";

const router = express.Router();

router.get("/", getBlendHandler);

export default router;

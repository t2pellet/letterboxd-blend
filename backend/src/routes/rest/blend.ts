import express from "express";
import { getBlendHandler } from "@/handlers/blend";
import { query } from "express-validator";
import validate from "@/middlewares/validate";

const router = express.Router();

router.get(
  "/",
  query("names")
    .isString()
    .trim("[]")
    .customSanitizer((input) => input.split(","))
    .isArray({ min: 1 }),
  query("top").default(10).isInt(),
  query("threshold").default(0.6).isFloat({ min: 0, max: 1 }),
  validate,
  getBlendHandler,
);

export default router;

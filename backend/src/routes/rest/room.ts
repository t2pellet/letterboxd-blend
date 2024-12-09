import express from "express";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import roomHandlers from "@/handlers/room";

const router = express.Router();

router.get(
  "/:id",
  param("id").isString().isLength({ min: 6, max: 6 }),
  validate,
  roomHandlers.getRoomHandler,
);
router.post("/", roomHandlers.createRoomHandler);
router.delete(
  "/:id",
  param("id").isString().isLength({ min: 6, max: 6 }),
  validate,
  roomHandlers.deleteRoomHandler,
);

export default router;

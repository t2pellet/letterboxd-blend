import express from "express";
import { param } from "express-validator";
import validate from "@/middlewares/validate";
import roomHandlers from "@/handlers/room";

const router = express.Router();

router.post("/", roomHandlers.createRoomHandler);
router.get(
  "/:id",
  param("id").isString().isLength({ min: 6, max: 6 }),
  validate,
  roomHandlers.getRoomHandler,
);
router.post(
  "/:id/start",
  param("id").isString().isLength({ min: 6, max: 6 }),
  validate,
  roomHandlers.startRoomHandler,
);
router.delete(
  "/:id",
  param("id").isString().isLength({ min: 6, max: 6 }),
  validate,
  roomHandlers.deleteRoomHandler,
);

export default router;

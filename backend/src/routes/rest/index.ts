import express from "express";
import roomRoutes from "./room";
import blendRoutes from "./blend";

const router = express.Router();

router.use("/room", roomRoutes);
router.use("/blend", blendRoutes);

export default router;

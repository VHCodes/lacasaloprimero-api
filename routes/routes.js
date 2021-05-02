import express from "express";

import apiRoutes from "./api/routes.js";
import imageRoutes from "../services/image/routes.js"

const router = express.Router();

router.use("/api", apiRoutes);
router.use("/image", imageRoutes);

export default router;

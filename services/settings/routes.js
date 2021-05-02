import express from "express";

import * as Controller from "./controller.js";

import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", Controller.getSettings);

router.put("/", [verifyToken, isAdmin], Controller.updateSettings);

export default router;

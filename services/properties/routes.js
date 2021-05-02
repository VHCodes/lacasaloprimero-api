import express from "express";

import * as Controller from "./controller.js";

import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/", [verifyToken, isAdmin], Controller.createProperty);

router.get("/", Controller.getProperties);

router.get("/:id", Controller.getProperty);

router.put("/:id", [verifyToken, isAdmin], Controller.updateProperty);

router.delete("/:id", [verifyToken, isAdmin], Controller.deleteProperty);

export default router;

import express from "express";

import * as Controller from "./controller.js";
import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/", [verifyToken, isAdmin], Controller.createPhoto);

router.get("/", Controller.getPhotos);

router.get("/:id", Controller.getPhoto);

router.delete("/:id", [verifyToken, isAdmin], Controller.deletePhoto);

export default router;

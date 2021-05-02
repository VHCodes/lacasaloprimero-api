import express from "express";

import * as Controller from "./controller.js";
import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/", [verifyToken, isAdmin], Controller.createCategory);

router.get("/", Controller.getCategories);

router.get("/:id", Controller.getCategory);

router.put("/:id", [verifyToken, isAdmin], Controller.updateCategory);

router.delete("/:id", [verifyToken, isAdmin], Controller.deleteCategory);

export default router;

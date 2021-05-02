import express from "express";

import * as Controller from "./controller.js";

import { isAdmin, verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", [verifyToken, isAdmin], Controller.getUsers);

router.get("/:id", [verifyToken, isAdmin], Controller.getUser);

router.put("/:id", [verifyToken, isAdmin], Controller.updateUser);

router.delete("/:id", [verifyToken, isAdmin], Controller.deleteUser);

export default router;

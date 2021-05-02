import express from "express";

import * as Controller from "./controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", Controller.signUp);

router.get("/confirm", Controller.confirm);

router.post("/login", Controller.logIn);

router.get("/verify", [verifyToken], Controller.verify);

router.post("/reset-password", Controller.requestResetPassword);

router.put("/reset-password", Controller.resetPassword);

router.put("/update-password", [verifyToken], Controller.updatePassword);

export default router;

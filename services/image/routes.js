import express from "express";

import * as Controller from "./controller.js";

const router = express.Router();

router.get("/photo/:photo", Controller.getPhoto);

router.get("/property/:property", Controller.getProperty);

export default router;

import express from "express";

import authRoutes from "../../services/auth/routes.js";
import usersRoutes from "../../services/users/routes.js";
import categoriesRoutes from "../../services/categories/routes.js";
import photosRoutes from "../../services/photos/routes.js";
import propertiesRoutes from "../../services/properties/routes.js";
import settingsRoutes from "../../services/settings/routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/photos", photosRoutes);
router.use("/properties", propertiesRoutes);
router.use("/settings", settingsRoutes);

export default router;

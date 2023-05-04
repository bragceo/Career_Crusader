import express from "express";
import { default as userRoutes } from "./userRoutes.js";
import { default as jobRoutes } from "./jobRoutes.js";

const router = express.Router();
router.use("/api/users/", userRoutes);

router.use("/api/jobs/", jobRoutes);

export default router;

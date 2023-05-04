import express from "express";
import auth from "../middlewares/auth.js";
import { deleteJob } from "../controllers/jobController.js";
const router = express.Router();

router.delete("/:id", auth, deleteJob);

export default router;

import express from "express";
import auth from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", auth, getUser);

export default router;

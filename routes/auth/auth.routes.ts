import express from "express";
import { register } from "../../controllers/auth/auth.controllers";
const authRoutes = express.Router();

authRoutes.post("/signup", register);

export { authRoutes }
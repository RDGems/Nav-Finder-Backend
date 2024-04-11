import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware";

const authRoutes = express.Router();
const { register, login, logout } = require("../../controllers/auth/auth.controllers");

authRoutes.post("/signup", register);
authRoutes.post("/login", login);

// secure routes
authRoutes.post("/logout", verifyToken, logout);

export { authRoutes }
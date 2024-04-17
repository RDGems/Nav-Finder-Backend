import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { onboarding } from "../../controllers/auth/auth.controllers";
import { userLoginValidator, userRegisterValidator, userOnboardingValidator } from "../../validators/auth/user.validators";
import { validate } from "../../validators/validate";

const authRoutes = express.Router();
const { register, login, logout } = require("../../controllers/auth/auth.controllers");

authRoutes.post("/signup", userRegisterValidator(), validate, register);
authRoutes.post("/login", userLoginValidator(), validate, login);

// secure routes
authRoutes.post("/logout", verifyToken, logout);
authRoutes.post("/onboarding", verifyToken, userOnboardingValidator(), validate, onboarding);
authRoutes.put("/edit-account", verifyToken, onboarding);

export { authRoutes }
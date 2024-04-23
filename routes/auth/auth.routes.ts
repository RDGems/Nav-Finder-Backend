import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { userLoginValidator, userRegisterValidator, userOnboardingValidator, passwordResetValidators } from "../../validators/auth/user.validators";
import { validate } from "../../validators/validate";
import { register, login, logout, refreshTokenGeneration, onboarding, verifyEmail, forgotPassword, resendEmailVerification, resetPassword, changePassword, getCurrentUser, verifyOtp, changeAccountStatus } from "../../controllers/auth/auth.controllers";

const authRoutes = express.Router();

authRoutes.post("/signup", userRegisterValidator(), validate, register);
authRoutes.post("/login", userLoginValidator(), validate, login);
authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.get("/refreshToken", refreshTokenGeneration);
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.post("/resetPassword", passwordResetValidators(), validate, resetPassword);
authRoutes.post("/verifyOtp", userLoginValidator(), validate, verifyOtp);

// secure routes
authRoutes.post("/logout", verifyToken, logout);
authRoutes.post("/onboarding", verifyToken, userOnboardingValidator(), validate, onboarding);
authRoutes.put("/edit-account", verifyToken, onboarding);
authRoutes.get("/resendEmailVerification", verifyToken, resendEmailVerification);
authRoutes.post("/changePassword", passwordResetValidators(), validate, verifyToken, changePassword);
authRoutes.get("/getCurrentUser", verifyToken, getCurrentUser);
authRoutes.post("/changeAccountStatus", verifyToken, changeAccountStatus);

export { authRoutes }
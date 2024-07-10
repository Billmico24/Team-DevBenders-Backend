import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { signupUser, loginUser, logoutUser, verifyEmail, resendVerifyEmail } from "../../controllers/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", ctrlWrapper(signupUser));
router.post("/login", ctrlWrapper(loginUser));
router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export { router as authRouter };

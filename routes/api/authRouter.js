import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { deleteUserController, signupUser, loginUser, logoutUser, verifyEmail, resendVerifyEmail, refreshToken } from "../../controllers/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Changed "/signup" to "/register" to match frontend
router.post("/register", ctrlWrapper(signupUser)); // <-- Changed
router.post("/login", ctrlWrapper(loginUser));
// Changed "/logout" method from GET to POST to match frontend
router.post("/logout", authenticateToken, ctrlWrapper(logoutUser)); // <-- Changed
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
// Removed authenticateToken from resendVerifyEmail endpoint to match frontend
router.post("/verify", ctrlWrapper(resendVerifyEmail)); // <-- Changed

//Route for refreshing tokens
router.post("/refresh", ctrlWrapper(refreshToken)); 

router.delete("/:userId", authenticateToken, deleteUserController);

export { router as authRouter };



/* import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { signupUser, loginUser, logoutUser, verifyEmail, resendVerifyEmail } from "../../controllers/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", ctrlWrapper(signupUser));
router.post("/login", ctrlWrapper(loginUser));
router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export { router as authRouter }; */

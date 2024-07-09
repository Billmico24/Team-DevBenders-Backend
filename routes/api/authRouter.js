import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import { signupUser, loginUser, logoutUser, verifyEmail, resendVerifyEmail} from "../../controllers/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

/* POST: // http://localhost:3000/api/users/signup
{
  "name" : "johndoee@gmail.com",
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/signup", ctrlWrapper(signupUser));

/* POST: // http://localhost:3000/api/users/login
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/login", ctrlWrapper(loginUser));

/* GET: // http://localhost:3000/api/users/logout */
router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));

/* GET: // http://localhost:3000/api/users/verify/:verificationToken */
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

/* POST: // http://localhost:3000/api/users/verify 
{
  "email": "example@example.com",
}
*/
router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export { router };
import express from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import * as ctrl from "../../controllers/authController.js";

import validateBody from "../../middlewares/validateBody.js";
import isValidId from "../../middlewares/isValidId.js";
import authorize from "../../middlewares/authorize.js";
import authenticateRefresh from "../../middlewares/authenticateRefresh.js";
import { schemas } from "../../models/users.js";
const router = express.Router();
// signup
router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrlWrapper(ctrl.register)
);
// login
router.post(
  "/login",
  validateBody(schemas.loginSchema),
  ctrlWrapper(ctrl.login)
);
// logout
router.post("/logout", ctrlWrapper(ctrl.logout));
// delete user
router.delete(
  "/:userId",
  authorize,
  isValidId,
  ctrlWrapper(ctrl.deleteUserController)
);
// refresh user
router.post(
  "/refresh",
  authenticateRefresh,
  validateBody(schemas.refreshTokenSchema),
  ctrlWrapper(ctrl.refresh)
);
// get current user
router.post("/current", authorize, ctrlWrapper(ctrl.getUserController));

export default router;

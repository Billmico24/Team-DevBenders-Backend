import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { getCurrentUsers, updateAvatar } from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

router.patch("/avatars", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

export { router as userRouter };

/*
import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { getCurrentUsers, updateAvatar } from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

router.patch("/avatars", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

export { router as userRouter };
*/
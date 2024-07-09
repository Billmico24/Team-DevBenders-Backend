import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import { getCurrentUsers, updateAvatar } from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

/* GET: // http://localhost:3000/api/users/current */
router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

/* PATCH: // http://localhost:3000/api/users/avatars
    form-data
    avatar,file : image
*/
router.patch("/avatars", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

export { router };
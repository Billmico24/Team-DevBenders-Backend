import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { User } from "../models/usersModel.js";

const getCurrentUsers = async (req, res) => {
  const { name, email } = req.user;

  try {
    res.json({ name, email });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  try {
    // Resize and save avatar
    await Jimp.read(oldPath).then((image) =>
      image.cover(250, 250).write(oldPath)
    );

    // Get file extension
    const extension = path.extname(originalname);
    const filename = `${_id}${extension}`;

    // Move avatar to public folder
    const newPath = path.join("public", "avatars", filename);
    await fs.rename(oldPath, newPath);

    // Update user with new avatar URL
    let avatarURL = path.join("/avatars", filename);
    avatarURL = avatarURL.replace(/\\/g, "/");

    await User.findByIdAndUpdate(_id, { avatarURL });

    // Avatar update success response
    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

export { getCurrentUsers, updateAvatar };

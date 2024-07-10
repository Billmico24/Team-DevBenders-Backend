import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { User } from "../models/usersModel.js";
// prettier-ignore

const getCurrentUsers = async (req, res) => {

    const { _id } = req.user;
    const result = await User.findOne({ _id });
    res.status(200).json(result);

//   const { name, email } = req.user;
//   res.json({
//     name,
//     email,
//   });

};


const updateAvatar = async (req, res) => {

  if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
  }
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  // Resize the image to dimension 250 by 250
  await Jimp.read(oldPath).then((image) =>
    // image.resize(250, 250).write(oldPath)
    image.cover(250, 250).write(oldPath)
  );

  // get the filename extension .jpg
  const extension = path.extname(originalname);

  const filename = `${_id}${extension}`;

  // move from tmp folder to avatar folder
  const newPath = path.join("public", "avatars", filename);
  await fs.rename(oldPath, newPath);

  let avatarURL = path.join("/avatars", filename);
  avatarURL = avatarURL.replace(/\\/g, "/");   // for Windows User

  await User.findByIdAndUpdate(_id, { avatarURL });  
  res.status(200).json({ avatarURL });
};

// prettier-ignore
export { getCurrentUsers, updateAvatar };
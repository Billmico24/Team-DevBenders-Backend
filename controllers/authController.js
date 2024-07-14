import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Summary from "../models/summary.js";
import { User } from "../models/users.js";
import { Session } from "../models/session.js";
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

import RequestError from "../helpers/requestError.js";

async function register(req, res) {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    passwordHash,
    userData: {
      weight: 0,
      height: 0,
      age: 0,
      bloodType: 0,
      desiredWeight: 0,
      dailyRate: 0,
      notAllowedProducts: [],
    },
    days: [],
  });

  res.status(201).send({
    username: newUser.username,
    email: newUser.email,
    id: newUser._id,
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw RequestError(401, "Invalid email or password");
  }
  const passwordCompare = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCompare) {
    throw RequestError(401, "Invalid email or password");
  }
  const payload = {
    id: user._id,
  };
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "24h",
  });
  const newSession = await Session.create({
    uid: user._id,
  });

  const date = new Date();
  const today = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const todaySummary = await Summary.findOne({ date: today });

  if (!todaySummary) {
    return res.status(200).send({
      accessToken,
      refreshToken,
      sid: newSession._id,
      todaySummary: {},
      user: {
        email: user.email,
        username: user.username,
        userData: user.userData,
        id: user._id,
      },
    });
  }
  return res.status(200).send({
    accessToken,
    refreshToken,
    sid: newSession._id,
    todaySummary: {
      date: todaySummary.date,
      kcalLeft: todaySummary.kcalLeft,
      kcalConsumed: todaySummary.kcalConsumed,
      dailyRate: todaySummary.dailyRate,
      percentsOfDailyRate: todaySummary.percentsOfDailyRate,
      userId: todaySummary.userId,
      id: todaySummary._id,
    },
    user: {
      email: user.email,
      username: user.username,
      userData: user.userData,
      id: user._id,
    },
  });
};

const refresh = async (req, res, next) => {
  const user = req.user;
  await Session.deleteMany({ uid: req.user._id });
  const payload = { id: user._id };
  const newSession = await Session.create({ uid: user._id });
  const newAccessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const newRefreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "24h",
  });

  return res
    .status(200)
    .send({ newAccessToken, newRefreshToken, sid: newSession._id });
};

const logout = async (req, res) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const accessToken = authorizationHeader.replace("Bearer ", "");
    let payload = {};
    try {
      payload = jwt.verify(accessToken, SECRET_KEY);
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const user = await User.findById(payload.id);
    await Session.findOneAndDelete({ uid: user._id });
    return res.status(204).json({ message: "logout success" });
  } else {
    return res.status(204).json({ message: "logout success" });
  }
};

const deleteUserController = async (req, res) => {
  const { userId } = req.params;
  await User.findOneAndDelete({ _id: userId });
  const currentSession = req.session;
  await Session.deleteOne({ _id: currentSession._id });
  res.status(200).json({ message: "user deleted" });
};

const getUserController = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOne({ _id });
  res.status(200).json(result);
};

export {
  register,
  login,
  logout,
  deleteUserController,
  refresh,
  getUserController,
};

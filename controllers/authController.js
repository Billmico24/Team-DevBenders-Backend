import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/usersModel.js";
import { signupValidation, loginValidation, emailValidation } from "../validations/joiValidation.js";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { v4 as uuid4 } from "uuid";

import { Session } from "../models/sessionModel.js";
import { Summary } from "../models/summaryModel.js";


const { SECRET_KEY, REFRESH_SECRET_KEY, PORT } = process.env;

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  // const { username, email, password, weight, 
  //         height, age, bloodType, desiredWeight, 
  //         dailyRate, notAllowedProducts, 
  //         notAllowedProductsAll} = req.body;

  try {
    // Registration validation
    const { error } = signupValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw httpError(409, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { protocol: "http" });
    const verificationToken = uuid4();

    // const result = await User.create({ name, email, password: hashPassword, 
    //   infouser: {currentWeight, height, age, desiredWeight, bloodType, dailyRate, 
    //     notAllowedProducts, notAllowedProductsAll}});
    
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
      userData: {
        weight: 0,
        height: 0,
        age: 0,
        bloodType: 0,
        desiredWeight: 0,
        dailyRate: 0,
        notAllowedProductsAll: [],
      },
      days: [],
    });

    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to SLIM MOM Service! Please Verify Your Email",
    //   html: `
    //     <div style="font-family: Arial, sans-serif; color: #333;">
    //       <h2>Welcome to SLIM MOM Service!</h2>
    //       <p>Hi there,</p>
    //       <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
    //       <p>
    //         <a 
    //           href="http://localhost:${PORT}/api/auth/verify/${verificationToken}" 
    //           style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;"
    //           target="_blank"
    //         >
    //           Verify Your Email
    //         </a>
    //       </p>
    //       <p>If you didn't sign up for our service, please ignore this email.</p>
    //       <p>Best regards,<br>Team DevBenders</p>
    //     </div>
    //   `,
    // });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        verificationToken,
        verificationLink: `http://localhost:${PORT}/api/auth/verify/${verificationToken}`,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login validation
    const { error } = loginValidation.validate(req.body);
    if (error) {
      throw httpError(401, error.message);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(401, "Email or password is wrong");
    }

    // Check if user is verified
    // if (!user.verify) {
    //   throw httpError(401, "Please verify your email before logging in");
    // }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw httpError(401, "Email or password is wrong");
    }

    // Generate token
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "24h" });
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
        token,
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

    // Update token in user document
    await User.findByIdAndUpdate(user._id, { token });

    // Login success response
    return res.status(200).send({
      token,
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
        verify: user.verify,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;

  try {
    // Clear token to log out
    await User.findByIdAndUpdate(_id, { token: "" });
    await Session.findOneAndDelete({ uid: _id }); 
    // Logout success response
    res.status(200).json({ message: "Successfully Logout" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }

};

// const logout = async (req, res) => {
//   const authorizationHeader = req.get("Authorization");
//   if (authorizationHeader) {
//     const accessToken = authorizationHeader.replace("Bearer ", "");
//     let payload = {};
//     try {
//       payload = jwt.verify(accessToken, SECRET_KEY);
//     } catch (err) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }
//     const user = await User.findById(payload.id);
//     await Session.findOneAndDelete({ uid: user._id });
//     return res.status(204).json({ message: "logout success" });
//   } else {
//     return res.status(204).json({ message: "logout success" });
//   };
// };



const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    // Find user by verification token
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw httpError(400, "User not found");
    }

    // Update user as verified
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    // Verification success response
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    const { error } = emailValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(404, "The provided email address could not be found");
    }

    // Resend verification email if user is not verified
    if (user.verify) {
      throw httpError(400, "Verification has already been passed");
    }

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Action Required: Verify Your Email",
      html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
    });

    // Resending email success response
    res.json({ message: "Verification email sent" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const refreshToken = async (req, res) => {
  const { token: oldRefreshToken } = req.body;
  try {
    const { id } = jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);
    const user = await User.findById(id);
    if (!user || user.refreshToken !== oldRefreshToken) 
    {
      throw httpError(403, "Forbidden");
    }
    await Session.deleteMany({ uid: req.user._id });
    const payload = { id: user._id };
    const { token, refreshToken } = generateTokens(payload);
    await User.findByIdAndUpdate(user._id, { token, refreshToken });
    res.json({ token, refreshToken,  sid: newSession._id });
  } catch (error) {
    throw httpError(403, "Invalid refresh token");
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

export { deleteUserController, getUserController, signupUser, loginUser, logoutUser, verifyEmail, resendVerifyEmail, refreshToken };

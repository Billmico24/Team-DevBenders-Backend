import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/usersModel.js";
// prettier-ignore
import { signupValidation, loginValidation, emailValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { v4 as uuid4 } from "uuid";

const { SECRET_KEY, PORT } = process.env;

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  //  Registration validation error
  const { error } = signupValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Registration conflict error
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in Use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a link to the user's avatar with gravatar
  const avatarURL = gravatar.url(email, { protocol: "http" });

  // Create a verificationToken for the user
  const verificationToken = uuid4();

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // Send an email to the user's mail and specify a link to verify the email (/users/verify/:verificationToken) in the message

  await sendEmail({
    to: email,
    subject: "Welcome to SLIM MOM Service! Please Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to SLIM MOM Service!</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
        <p>
          <a 
            href="http://localhost:${PORT}/api/auth/verify/${verificationToken}" 
            style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;"
            target="_blank"
          >
            Verify Your Email
          </a>
        </p>
        <p>If you didn't sign up for our service, please ignore this email.</p>
        <p>Best regards,<br>Team DevBenders</p>
      </div>
    `,
  });
  

  // Registration success response
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
      verificationToken,
      verificationLink: `http://localhost:${PORT}/api/auth/verify/${verificationToken}` 
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //  Login validation error
  const { error } = loginValidation.validate(req.body);
  if (error) {
    throw httpError(401, error.message);
  }

  // Login auth error (email)
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  // Login auth Check if the user is verified
  if (!user.verify) {
    throw httpError(401, "Please verify your email before logging in");
  }

  // Login auth error (password)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  //   Login success response
  res.status(200).json({
    token: token,
    user: {
      name: user.name,
      email: user.email,
      verify: user.verify,
      avatarURL: user.avatarURL,
    },
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;

  // Logout unauthorized error (setting token to empty string will remove token -> will logout)
  await User.findByIdAndUpdate(_id, { token: "" });

  // Logout success response
  // res.status(204).send();
  res.status(200).json({ message: "Successfully Logout" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  // Verification user Not Found
  if (!user) {
    throw httpError(400, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  // Verification success response
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending a email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, "The provided email address could not be found");
  }

  // Resend email for verified user
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }

  await sendEmail({
    to: email,
    subject: "Action Required: Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  });

  // Resending a email success response
  res.json({ message: "Verification email sent" });
};
// prettier-ignore
export { signupUser, loginUser, logoutUser , verifyEmail, resendVerifyEmail };
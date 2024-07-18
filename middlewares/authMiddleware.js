import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

export const authenticateToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(httpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    // console.log('user',user);
    // console.log('token',token);
    // console.log('user.token',user.token)

    // if (!user || user.token !== token) {
    //   return next(httpError(401, "Not authorized"));
    // }

    req.user = user;
    next();
  } catch (error) {
    next(httpError(401, "Not authorized"));
  }
};

export default authenticateToken;

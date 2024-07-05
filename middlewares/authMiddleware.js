import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";
const { SECRET_KEY } = process.env;

const authenticateToken = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || user.token !== token || !user.token) {
      next(httpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

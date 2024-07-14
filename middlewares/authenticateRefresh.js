import jwt from "jsonwebtoken";

import { User } from "../models/users.js";
import { Session } from "../models/session.js";

const { REFRESH_SECRET_KEY } = process.env;

const authenticateRefresh = async (req, res, next) => {
  const sidReq = req.body.sid;
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader) {
    const refreshToken = authorizationHeader.replace("Bearer ", "");
    let payload = {};
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const user = await User.findById(payload.id);
    const sessionUser = await Session.findOne({ uid: user._id });
    const sessionReq = await Session.findOne({ _id: sidReq });

    if (!user) {
      return res.status(404).send({ message: "Invalid user" });
    }
    if (!sessionReq || !sessionUser) {
      return res.status(404).send({ message: "Invalid session" });
    }
    req.user = user;
    req.session = sessionReq;
    next();
  } else return res.status(400).send({ message: "No token provided" });
};

export default authenticateRefresh;

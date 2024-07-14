import isValidObjectId from "mongoose";

import RequestError from "../helpers/requestError.js";

const isValidId = (req, res, next) => {
  const { transitionId } = req.params;
  const { userId } = req.params;
  if (!isValidObjectId(transitionId || userId)) {
    next(RequestError(400, "is not valid id format"));
  }
  next();
};

export default isValidId;

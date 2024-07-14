import RequestError from "../helpers/requestError.js";

const validateBody = (schema) => {
  const func = async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(RequestError(400));
    }
    next();
  };

  return func;
};

export default validateBody;

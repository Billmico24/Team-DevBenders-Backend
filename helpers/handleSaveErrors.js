const handleSaveErrors = (error, data, next) => {
  const { code, name } = error;
  error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  if (Object.keys(data).length === 0) {
    return error.status;
  } else {
    next();
  }
};

export default handleSaveErrors;

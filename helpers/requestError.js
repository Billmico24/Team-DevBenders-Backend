const messages = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

const RequestError = (status, message) => {
  const errorMessage = message || messages[status] || "Unknown error";
  const error = new Error(errorMessage);
  error.status = status;
  return error;
};

export default RequestError;

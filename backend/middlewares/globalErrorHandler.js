import config from "../config/index.js";
import { ErrorService } from "../services/ErrorService.js";
import ValidationError from "joi";

const globalErrorHandler = (err, req, res, next) => {
  /* DEFAULT ERROR = SERVER ERROR */
  // console.log(err);
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",
    ...(config.DEBUG_MODE === "true" && {
      originalError: err.message,
    }),
  };
  /* JOI ERROR */
  if (err instanceof ValidationError.ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }

  /* CUSTOM ERRORS */
  if (err instanceof ErrorService) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default globalErrorHandler;

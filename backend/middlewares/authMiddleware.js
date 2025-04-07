import config from "../config/index.js";
import { ErrorService } from "../services/ErrorService.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  let accessToken;

  // Check if token is passed in the Authorization header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.split(" ")[1];
  }

  // If token is not found in header, check for cookie
  if (!accessToken) {
    accessToken = req.cookies.accessToken;
  }

  // If neither header nor cookie contains token, return error
  if (!accessToken) {
    return next(ErrorService.unAuthorizedError("Access token is required"));
  }

  try {
    const { _id, jti } = jwt.verify(accessToken, config.ACCESS_TOEKN_SECRET_KEY);
    req.userID = _id;
    req.jti = jti;
    next();
  } catch (error) {
    next(ErrorService.unAuthorizedError("Invalid or expired access token"));
  }
};

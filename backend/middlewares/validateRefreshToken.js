import config from "../config/index.js";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import { ErrorService } from "../services/ErrorService.js";
import jwt from "jsonwebtoken";

export const validateRefreshToken = async (req, res, next) => {
  // GET TOKEN FROM COOKIE
  const { refreshToken } = req.cookies;
  // VALIDATE TOKEN
  if (!refreshToken) {
    return next(ErrorService.badRequestError("Refresh Token is required"));
  }
  //   Validate Token
  let data;
  try {
    data = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    return next(ErrorService.badRequestError("Invalid refresh token"));
  }
  // CHECK INTO DB
  try {
    const isExist = await RefreshTokenModel.findById(data.jti);
    if (!isExist) {
      return next(ErrorService.badRequestError("Token is revoked"));
    }
  } catch (error) {
    return next(error);
  }

  req.data = data;
  next();
};

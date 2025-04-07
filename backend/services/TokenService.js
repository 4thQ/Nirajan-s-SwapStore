import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import config from "../config/index.js";

export class TokenService {
  async generateAccessToken(payload) {
    return jwt.sign(payload, config.ACCESS_TOEKN_SECRET_KEY, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });
  }

  async generateRefreshToken(payload, jwtid) {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
      jwtid: String(jwtid),
    });
  }

  async persistRefreshToken(userID) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    return await RefreshTokenModel.create({
      userID,
      expiresAt: Date.now() + MS_IN_YEAR,
    });
  }

  async deleteRefreshToken(tokenID) {
    await RefreshTokenModel.findByIdAndDelete(tokenID);
  }
}
const tokenService = new TokenService();
export default tokenService;

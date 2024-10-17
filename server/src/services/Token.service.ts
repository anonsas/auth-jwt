import jwt from "jsonwebtoken";
import { TokenModel } from "../models";
import { Types } from "mongoose";
import { UserDTO } from "../dto";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN || "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN || "";

export class TokenService {
  //================================================================================
  generateTokens(payload: UserDTO): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
    return { accessToken, refreshToken };
  }

  //================================================================================
  async saveRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    // Attempt to find an existing token for the user
    const tokenData = await TokenModel.findOne({ user: userId });

    if (tokenData) {
      // Update the existing refresh token
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    // Create a new token entry if it doesn't exist
    return await TokenModel.create({ user: userId, refreshToken });
  }

  //================================================================================
  verifyAccessToken(accessToken: string): UserDTO | null {
    try {
      return jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as UserDTO;
    } catch {
      return null;
    }
  }

  //================================================================================
  verifyRefreshToken(refreshToken: string): any | null {
    try {
      return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as UserDTO;
    } catch {
      return null;
    }
  }

  //================================================================================
  async removeRefreshToken(refreshToken: string) {
    return await TokenModel.findOneAndDelete({ refreshToken });
  }

  //================================================================================
  async findRefreshToken(refreshToken: string) {
    return await TokenModel.findOne({ refreshToken });
  }
}

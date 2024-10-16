import jwt from "jsonwebtoken";
import { TokenModel } from "../models";
import { Types } from "mongoose";

const ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || "";
const REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || "";

type PayloadType = {
  id: Types.ObjectId;
  email: string;
  isActivated: boolean;
};

export class TokenService {
  generateTokens(payload: PayloadType) {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "30d" });
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    // Re-writing existing refreshToken
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    // Means user is logged-in for the first time and no tokens in the DB
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeRefreshToken(refreshToken: string) {
    const tokenData = await TokenModel.findOneAndDelete({ refreshToken });
    console.log("tokenData", tokenData);

    return tokenData;
  }
}

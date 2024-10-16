import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

export const TokenModel = mongoose.model("Token", schema);

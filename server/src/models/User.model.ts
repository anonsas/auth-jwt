import mongoose from "mongoose";
const { Schema } = mongoose;

// Fat models
const schema = new Schema({
  // name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

export const UserModel = mongoose.model("User", schema);

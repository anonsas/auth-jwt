import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";

const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGOD_DB || "");

    app.listen(PORT, () => {
      console.log(`Server is running on ${API_URL}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startServer();

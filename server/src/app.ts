import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

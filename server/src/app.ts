import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { globalErrorMiddleware } from "./middlewares/GlobalError.middleware";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);
app.use(globalErrorMiddleware);

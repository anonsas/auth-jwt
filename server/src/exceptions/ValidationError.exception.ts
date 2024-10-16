import { Request, Response, NextFunction } from "express";

export function ValidationErrorException(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error("Error 💥", error.stack);
  response.status(500).json({ message: error.message || "Internal Server Error" });
}

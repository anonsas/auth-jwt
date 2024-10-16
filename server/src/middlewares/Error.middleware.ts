import { Request, Response, NextFunction } from "express";
import { ApiErrorException } from "../exceptions";
import { z } from "zod";

export function ErrorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error("Error 💥", error.stack);

  if (error instanceof ApiErrorException) {
    return response.status(error.status).json({ message: error.message, errors: error.errors });
  }

  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    return response.status(400).json({
      message: "Validation error",
      errors: formattedErrors,
    });
  }

  response.status(500).json({ message: "Internal Server Error" });
}

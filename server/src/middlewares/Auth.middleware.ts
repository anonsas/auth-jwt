import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";
function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.split(" ")[1]; // Extract token from Bearer
  if (!token) return response.status(401).json({ message: "No token provided" });

  // Verify the token
  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN || "");
    // request.user = user;
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return response.status(403).json({ message: "Invalid token" });
  }
}

import type { Request, Response, NextFunction } from "express";
import { TokenService } from "../services";
import { ApiErrorException } from "../exceptions";
import { UserDTO } from "../dto";

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}

const tokenService = new TokenService();

export function AuthMiddleware(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) return next(ApiErrorException.UnauthorizedError());

  const accessToken = authorizationHeader.split(" ")[1]; // Extract accessToken from Bearer token
  if (!accessToken) return next(ApiErrorException.UnauthorizedError());

  try {
    const user = tokenService.verifyAccessToken(accessToken);
    if (!user) return next(ApiErrorException.UnauthorizedError());

    request.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return next(ApiErrorException.UnauthorizedError());
  }
}

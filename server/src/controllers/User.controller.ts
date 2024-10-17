import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/User.service";
import { z } from "zod";

const userService = new UserService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

const days30 = 30 * 24 * 60 * 60 * 1000;

export class UserController {
  //================================================================================
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(request.body);
      const user = await userService.register(email, password);

      response.cookie("refreshToken", user.refreshToken, { maxAge: days30, httpOnly: true });
      return response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  //================================================================================
  async activateLink(request: Request, response: Response, next: NextFunction) {
    try {
      const activationLink = request.params.link;
      await userService.activateLink(activationLink);

      return response.redirect(process.env.CLIENT_URL || "");
    } catch (error) {
      next(error);
    }
  }

  //================================================================================
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(request.body);
      const userData = await userService.login(email, password);

      response.cookie("refreshToken", userData.refreshToken, { maxAge: days30, httpOnly: true });
      return response.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  //================================================================================
  async logout(request: Request, response: Response, next: NextFunction) {
    try {
      const refreshToken = request.cookies.refreshToken;
      await userService.logout(refreshToken);

      response.clearCookie("refreshToken");
      return response.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  //================================================================================
  async refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
      const refreshToken = request.cookies.refreshToken;
      const userData = await userService.refreshToken(refreshToken);
      response.cookie("refreshToken", userData.refreshToken, { maxAge: days30, httpOnly: true });
      return response.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  //================================================================================
  async getUsers(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      return response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

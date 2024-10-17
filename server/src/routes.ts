import { Router } from "express";
import { UserController } from "./controllers/User.controller";

const userController = new UserController();
export const router = Router();

router.post("/register", userController.register);
router.get("/activate/:link", userController.activateLink);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh-token", userController.refreshToken);
// router.get("/users", userController.getUsers);

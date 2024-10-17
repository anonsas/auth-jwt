import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { MailService, TokenService } from ".";
import { ApiErrorException } from "../exceptions";
import { UserDTO } from "../dto";

const mailService = new MailService();
const tokenService = new TokenService();

export class UserService {
  //================================================================================
  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw ApiErrorException.BadRequest(`User with email: ${email} already exists`);
    }

    // Hash password and generate activation link
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    // Create new user
    const user = await UserModel.create({ email, password: hashedPassword, activationLink });
    if (!user) throw ApiErrorException.UnauthorizedError();

    // Send activation email
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/activate/${activationLink}`
    );

    // Generate and save tokens
    const userDTO = new UserDTO(user);
    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { accessToken, refreshToken, user: userDTO };
  }

  //================================================================================
  async activateLink(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiErrorException.BadRequest("Invalid activation link");
    }

    user.isActivated = true;
    user.activationLink = null;
    await user.save();
  }

  //================================================================================
  async login(email: string, password: string) {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiErrorException.BadRequest("User with this email is not found");
    }

    // Check if password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ApiErrorException.BadRequest("Incorrect password");
    }

    // Generate and return tokens
    const userDTO = new UserDTO(user);
    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { accessToken, refreshToken, user: userDTO };
  }

  //================================================================================
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw ApiErrorException.UnauthorizedError();
    }
    await tokenService.removeRefreshToken(refreshToken);
  }

  //================================================================================
  async refreshToken(token: string) {
    if (!token) {
      throw ApiErrorException.UnauthorizedError();
    }

    // Verify the refresh token and check if it exists in the database
    const userData = tokenService.verifyRefreshToken(token);
    const tokenFromDB = await tokenService.findRefreshToken(token);

    if (!userData || !tokenFromDB || typeof userData !== "object" || !("id" in userData)) {
      throw ApiErrorException.UnauthorizedError();
    }

    // Fetch the user and generate new tokens
    const user = await UserModel.findById(userData.id);
    if (!user) throw ApiErrorException.UnauthorizedError();

    const userDTO = new UserDTO(user);
    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { accessToken, refreshToken, user: userDTO };
  }

  //================================================================================
  async getUsers() {
    const users = await UserModel.find();
    const usersDTO: UserDTO[] = users.map((user) => new UserDTO(user));
    return usersDTO;
  }
}

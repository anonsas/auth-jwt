import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { MailService, TokenService } from ".";
import { ApiErrorException } from "../exceptions";
import { UserDTO } from "../dto";

const mailService = new MailService();
const tokenService = new TokenService();

// Business logic
export class UserService {
  async register(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiErrorException.BadRequest(`User with this email: ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const link = uuidv4();

    const user = await UserModel.create({ email, password: hashPassword, activationLink: link });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${link}`);

    const userDTO = new UserDTO(user);
    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });

    await tokenService.saveRefreshToken(userDTO.id, refreshToken);
    return { accessToken, refreshToken, user: userDTO };
  }

  //================================================================================
  async activateLink(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) throw ApiErrorException.BadRequest("Invalid activation link");

    user.isActivated = true;
    user.activationLink = null;
    await user.save();
  }

  //================================================================================
  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiErrorException.BadRequest("User with this email is not found");

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) throw ApiErrorException.BadRequest("Wrong password");

    const userDTO = new UserDTO(user);
    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });

    await tokenService.saveRefreshToken(userDTO.id, refreshToken);
    return { accessToken, refreshToken, user: userDTO };
  }

  //================================================================================
  async logout() {}

  //================================================================================
  async refreshToken() {}

  //================================================================================
  async getUsers() {}
}

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { MailService, TokenService } from ".";
import { UserDTO } from "../dto";

const mailService = new MailService();
const tokenService = new TokenService();

// Business logic
export class UserService {
  // private createUserDTO(user: any) {
  //   return {
  //     id: user._id,
  //     email: user.email,
  //     isActivated: user.isActivated,
  //   };
  // }

  async register(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) throw new Error(`User with this email: ${email} already exists`);

    const hashPassword = await bcrypt.hash(password, 10);
    const link = uuidv4();

    const user = await UserModel.create({ email, password: hashPassword, activationLink: link });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${link}`);

    const userDTO = {
      id: user._id,
      email: user.email,
      isActivated: user.isActivated,
    };

    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { accessToken, refreshToken, user: userDTO };
  }

  async activateLink(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) throw new Error("Invalid activation link");

    user.isActivated = true;
    user.activationLink = null;
    await user.save();
  }

  async login(email: string, password: string) {
    // const { email, password } = registerSchema.parse(request.body);
    // const token = await userService.login(email, password);
    // return response.status(200).json({ token });
  }

  async logout() {}

  async refreshToken() {}

  async getUsers() {}
}

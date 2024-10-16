import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { MailService, TokenService } from ".";
import { UserDTO } from "../dto";

const mailService = new MailService();
const tokenService = new TokenService();

// Business logic
export class UserService {
  async register(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) throw new Error(`User with this email: ${email} already exists`);

    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = `${process.env.API_URL}/${uuidv4()}`;

    const user = await UserModel.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(email, activationLink);

    const userDTO = {
      id: user._id,
      email: user.email,
      isActivated: user.isActivated,
    };

    const { accessToken, refreshToken } = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveRefreshToken(userDTO.id, refreshToken);

    return { accessToken, refreshToken, user: userDTO };
  }

  async login(email: string, password: string) {
    // const { email, password } = registerSchema.parse(request.body);
    // const token = await userService.login(email, password);
    // return response.status(200).json({ token });
  }

  async logout() {}

  async activateLink(link: string) {}

  async refreshToken() {}

  async getUsers() {}
}

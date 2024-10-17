import { UserType } from "../User.type";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserType;
};

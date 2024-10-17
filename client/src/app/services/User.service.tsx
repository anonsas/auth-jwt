import { AxiosResponse } from "axios";
import { $api } from "../http";
import { UserType } from "../types/User.type";

export class UserService {
  static async getUsers(): Promise<AxiosResponse<UserType[]>> {
    return $api.get<UserType[]>("/users");
  }
}

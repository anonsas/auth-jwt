import { Types } from "mongoose";

type ModelType = {
  _id: Types.ObjectId;
  email: string;
  isActivated: boolean;
  activationLink: string | null | undefined;
};

export class UserDTO {
  id;
  email;
  isActivated;

  constructor(model: ModelType) {
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}

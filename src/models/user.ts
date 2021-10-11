import AuthService from "@services/auth";
import logger from "@src/logger";
import mongoose, { Document, Model } from "mongoose";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = "DUPLICATED",
}

const schema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    name: { required: true, type: String },
    password: { required: true, type: String },
  },
  {
    toJSON: {
      transform: (_doc, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  "já existe no banco de dados",
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>("save", async function (): Promise<void> {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    logger.error(`Error de hash na senha do Usuário ${this.name}`);
  }
});

interface UserModel extends Omit<User, "_id">, Document {}

export const User: Model<UserModel> = mongoose.model("User", schema);

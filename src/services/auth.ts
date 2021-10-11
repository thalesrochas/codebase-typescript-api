import { User } from "@models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface DecodedUser extends Omit<User, "_id"> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedUser;
  }
}

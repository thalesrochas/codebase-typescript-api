import { User } from "@models";
import AuthService from "@services/auth";
import ApiError from "@util/errors/api-error";
import { NextFunction, Request, Response } from "express";

export async function auth(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): Promise<void> {
  const token = req.headers?.["x-access-token"];

  try {
    const decoded = AuthService.decodeToken(token as string);
    const user = (await User.findById(decoded.id))?.toJSON() || {};

    req.user = { ...decoded, ...user };
    next();
  } catch (error) {
    res
      .status?.(401)
      .send(ApiError.format({ code: 401, message: (error as Error).message }));
  }
}

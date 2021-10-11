import AuthService from "@services/auth";
import ApiError from "@src/util/errors/api-error";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.["x-access-token"];

  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (err) {
    res
      .status?.(401)
      .send(ApiError.format({ code: 401, message: (err as Error).message }));
  }
}

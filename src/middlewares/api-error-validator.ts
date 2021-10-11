/* eslint-disable @typescript-eslint/no-unused-vars */
import ApiError from "@util/errors/api-error";
import { NextFunction, Request, Response } from "express";

export interface HTTPError extends Error {
  status?: number;
}

export function apiErrorValidator(
  error: HTTPError,
  _req: Partial<Request>,
  res: Response,
  _next: NextFunction
): void {
  const errorCode = error.status || 500;
  res
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
}

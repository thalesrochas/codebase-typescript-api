import { DecodedUser } from "@services/auth";
import { NextFunction, Request, Response } from "express";
import * as http from "http";

declare module "express-serve-static-core" {
  export interface Request extends http.IncomingMessage, Express.Request {
    user?: DecodedUser;
  }
}

declare global {
  export type MiddlewareFunction = (
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
  ) => void;
}

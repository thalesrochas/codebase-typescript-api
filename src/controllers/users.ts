import { authMiddleware } from "@middlewares/auth";
import { User } from "@models/user";
import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import AuthService from "@services/auth";
import ApiError from "@util/errors/api-error";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

import { BaseController } from "./index";

const rateLimiter = rateLimit({
  handler(_req, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: "Muitas tentativas de autenticação.",
      })
    );
  },
  keyGenerator(req: Request): string {
    return req.ip;
  },
  max: 5, // 5 attempts
  windowMs: 10 * 60 * 1000, // 10 minutes
});

@Controller("users")
export class UsersController extends BaseController {
  @Post("")
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post("authenticate")
  @Middleware(rateLimiter)
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Usuário não encontrado!",
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Senha não corresponde!",
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ ...user.toJSON(), token });
  }

  @Get("me")
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: "Usuário não encontrado!",
      });
    }

    return res.status(200).send(user);
  }
}

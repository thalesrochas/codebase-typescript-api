import { BaseController } from "@controllers";
import { auth } from "@middlewares/auth";
import { User } from "@models";
import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import AuthService from "@services/auth";
import ApiError from "@util/errors/api-error";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

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
    const { email, senha } = req.body;

    if (!email || !senha) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Email e/ou Senha não informado(s).",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Usuário não encontrado!",
      });
    }

    if (!(await AuthService.comparePasswords(senha, user.senha))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "Senha não corresponde!",
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ token });
  }

  @Get("me")
  @Middleware(auth)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.user?.email;
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

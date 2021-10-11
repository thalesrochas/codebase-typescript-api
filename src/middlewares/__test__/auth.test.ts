import AuthService from "@services/auth";

import { authMiddleware } from "../auth";

describe("Auth Middleware", () => {
  it("deve verificar um token JWT e chamar a próxima middleware", async () => {
    const jwtToken = AuthService.generateToken({ data: "fake" });

    const reqFake = { headers: { "x-access-token": jwtToken } };
    const resFake = {};
    const nextFake = jest.fn();

    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });

  it("deve retornar UNAUTHORIZED se houver um problema na verificação do token", async () => {
    const reqFake = { headers: { "x-access-token": "invalid token" } };
    const sendMock = jest.fn();
    const resFake = { status: jest.fn(() => ({ send: sendMock })) };
    const nextFake = jest.fn();

    authMiddleware(reqFake, resFake as Record<string, unknown>, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 401,
        message: "jwt malformed",
      })
    );
  });

  it("deve retornar a middleware UNAUTHORIZED se não houver token", async () => {
    const reqFake = { headers: {} };
    const sendMock = jest.fn();
    const resFake = { status: jest.fn(() => ({ send: sendMock })) };
    const nextFake = jest.fn();

    authMiddleware(reqFake, resFake as Record<string, unknown>, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 401,
        message: "jwt must be provided",
      })
    );
  });
});

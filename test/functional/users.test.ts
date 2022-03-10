import { User } from "@models";
import AuthService from "@services/auth";

describe("Testes funcionais de Usuário", () => {
  beforeEach(async () => await User.deleteMany());

  describe("Ao criar um novo usuário", () => {
    it("deve criar com sucesso um novo usuário com senha criptografada", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      const response = await global.testRequest.post("/users").send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePasswords(newUser.senha, response.body.senha)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({ ...newUser, senha: expect.any(String) })
      );
    });

    it("deve retornar 400 quando houver um erro de validação", async () => {
      const newUser = {
        email: "john@mail.com",
        senha: "12345678",
      };

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: "Bad Request",
        message: "User validation failed: nome: Path `nome` is required.",
      });
    });

    it("deve retornar 409 quando o email já existe", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      await global.testRequest.post("/users").send(newUser);
      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: "Conflict",
        message: "User validation failed: email: já existe no banco de dados",
      });
    });
  });

  describe("Ao autenticar um usuário", () => {
    it("deve gerar um token para um usuário válido", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, senha: newUser.senha });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it("deve retornar UNAUTHORIZED se o usuário com o e-mail fornecido não for encontrado", async () => {
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: "some-email@mail.com", senha: "12345678" });

      expect(response.status).toBe(401);
    });

    it("deve retornar UNAUTHORIZED se o usuário for encontrado, mas a senha não corresponder", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, senha: "different password" });

      expect(response.status).toBe(401);
    });
  });

  describe("Ao obter informações do usuário", () => {
    it("deve retornar as informações do proprietário do token", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      const user = await new User(newUser).save();
      const token = AuthService.generateToken(user.toJSON());
      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(200);
      expect(body).toMatchObject(JSON.parse(JSON.stringify(user)));
    });

    it("deve retornar Not Found, quando o usuário não for encontrado", async () => {
      const newUser = {
        email: "john@mail.com",
        nome: "John Doe",
        senha: "12345678",
      };

      // Create a new user but don't save it
      const user = new User(newUser);
      const token = AuthService.generateToken(user.toJSON());
      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(404);
      expect(body.message).toBe("Usuário não encontrado!");
    });
  });
});

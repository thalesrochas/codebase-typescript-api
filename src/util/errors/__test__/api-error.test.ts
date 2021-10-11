import ApiError from "../api-error";

describe("ApiError", () => {
  it("deve formatar o erro com campos obrigatórios", async () => {
    const error = ApiError.format({
      code: 404,
      message: "Usuário não encontrado!",
    });
    expect(error).toEqual({
      code: 404,
      error: "Not Found",
      message: "Usuário não encontrado!",
    });
  });

  it("deve formatar o erro com campos obrigatórios e descrição", async () => {
    const error = ApiError.format({
      code: 404,
      description: "Esse erro acontece quando o usuário não foi encontrado.",
      message: "Usuário não encontrado!",
    });
    expect(error).toEqual({
      code: 404,
      description: "Esse erro acontece quando o usuário não foi encontrado.",
      error: "Not Found",
      message: "Usuário não encontrado!",
    });
  });

  it("deve formatar o erro com campos obrigatórios, descrição e documentação", async () => {
    const error = ApiError.format({
      code: 404,
      description: "Esse erro acontece quando o usuário não foi encontrado.",
      documentation: "https://mydocs.com/error-404",
      message: "Usuário não encontrado!",
    });
    expect(error).toEqual({
      code: 404,
      description: "Esse erro acontece quando o usuário não foi encontrado.",
      documentation: "https://mydocs.com/error-404",
      error: "Not Found",
      message: "Usuário não encontrado!",
    });
  });
});

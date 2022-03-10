import logger from "@src/logger";
import ApiError, { APIError } from "@util/errors/api-error";
import { Response } from "express";
import mongoose from "mongoose";

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    error: unknown
  ): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = this.handleValidationErrors(error);

      return res.status(validationErrors.code).send(
        ApiError.format({
          code: validationErrors.code,
          message: validationErrors.error,
        })
      );
    } else if (error instanceof mongoose.Error.StrictModeError) {
      const strictModeErrors = this.handleStrictModeErrors(error);

      return res.status(strictModeErrors.code).send(
        ApiError.format({
          code: strictModeErrors.code,
          message: strictModeErrors.error,
        })
      );
    } else {
      logger.error(error as Error);
      return res
        .status(500)
        .send(ApiError.format({ code: 500, message: "Algo deu errado." }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }

  private handleValidationErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindErrors = Object.values(error.errors).filter(err => {
      if (
        err instanceof mongoose.Error.ValidatorError ||
        err instanceof mongoose.Error.CastError
      ) {
        return err.kind === "DUPLICATED";
      }
      return false;
    });

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }

    return { code: 400, error: error.message };
  }

  private handleStrictModeErrors(error: mongoose.Error.StrictModeError): {
    code: number;
    error: string;
  } {
    if (!error.path) {
      logger.error(error as Error);
      return {
        code: 500,
        error: "Algo deu errado.",
      };
    }

    if (error.isImmutableError) {
      return {
        code: 403,
        error: `Não é possível alterar o campo \`${error.path}\`.`,
      };
    }

    return {
      code: 400,
      error: `O campo \`${error.path}\` não existe.`,
    };
  }
}

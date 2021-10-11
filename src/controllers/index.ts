import { CUSTOM_VALIDATION } from "@models/user";
import logger from "@src/logger";
import ApiError, { APIError } from "@util/errors/api-error";
import { Response } from "express";
import mongoose from "mongoose";

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        })
      );
    } else {
      logger.error(error as Error);
      res
        .status(500)
        .send(ApiError.format({ code: 500, message: "Algo deu errado!" }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindErrors = Object.values(error.errors).filter(err => {
      if (
        err instanceof mongoose.Error.ValidatorError ||
        err instanceof mongoose.Error.CastError
      ) {
        return err.kind === CUSTOM_VALIDATION.DUPLICATED;
      }
      return false;
    });

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 400, error: error.message };
  }
}

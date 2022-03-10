// "./util/module-alias" deve ser o primeiro import deste arquivo
import "./util/module-alias";

import * as Controllers from "@controllers";
import { apiErrorValidator } from "@middlewares/api-error-validator";
import { Server } from "@overnightjs/core";
import * as database from "@src/database";
import logger from "@src/logger";
import cors from "cors";
import { Application, json } from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import expressPino from "express-pino-logger";
import swaggerUi from "swagger-ui-express";

import apiSchema from "./openapi.json";

export class SetupServer extends Server {
  constructor(private port: string | number = 3002) {
    super();
  }

  public async init(): Promise<void> {
    this.SetupExpress();
    this.docsSetup();
    this.setupController();
    await this.databaseSetup();
    this.setupErrorHandlers();
  }

  private SetupExpress(): void {
    this.app.use(json());
    this.app.use(expressPino({ logger }));
    this.app.use(cors({ origin: "*" }));
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private docsSetup(): void {
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSchema));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true,
      })
    );
  }

  private setupController(): void {
    const usersController = new Controllers.UsersController();

    this.addControllers([usersController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server: Server is listening on port ${this.port}`);
    });
  }
}

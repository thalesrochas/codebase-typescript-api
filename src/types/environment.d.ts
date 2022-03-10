import P from "pino";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NODE_ENV: "test" | "development" | "production";
      PINO_LOGGER_ENABLED: string;
      PINO_LOGGER_LEVEL: P.Level;
      PINO_LOGGER_LEVEL_DB: P.Level;
      PORT?: string;
      JWT_SECRET: string;
      JWT_EXPIRES: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
// export {};

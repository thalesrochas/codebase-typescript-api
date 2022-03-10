import pino from "pino";

export default pino({
  enabled: process.env.PINO_LOGGER_ENABLED === "true",
  transport: {
    targets: [
      {
        level: process.env.PINO_LOGGER_LEVEL_DB,
        options: {
          collection: "logs",
          uri: process.env.MONGODB_URI,
        },
        target: "pino-mongodb",
      },
      {
        level: process.env.PINO_LOGGER_LEVEL,
        options: {
          colorize: true,
          destination: 1,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        },
        target: "pino-pretty",
      },
    ],
  },
});

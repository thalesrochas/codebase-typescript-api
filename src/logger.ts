import pino from "pino";

export default pino({
  enabled: process.env.PINO_LOGGER_ENABLED === "true",
  level: process.env.PINO_LOGGER_LEVEL,
});

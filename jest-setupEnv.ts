/* eslint-disable no-console */
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

try {
  dotenv.config();
  const envConfig = dotenv.parse(readFileSync(join(__dirname, ".env.test")));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
} catch (error) {
  console.log(
    "Failed to set Environment Variables for tests:",
    (error as Error).message
  );
}

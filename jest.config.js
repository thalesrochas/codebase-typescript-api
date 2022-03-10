const { resolve } = require("path");
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: "root-tests",
  setupFiles: ["<rootDir>/jest-setupEnv.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  testEnvironment: "node",
  clearMocks: true,
  preset: "ts-jest",
  moduleNameMapper: {
    "@clients/(.*)": "<rootDir>/src/clients/$1",
    "@controllers": "<rootDir>/src/controllers",
    "@fixtures/(.*)": "<rootDir>/test/fixtures/$1",
    "@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
    "@models": "<rootDir>/src/models",
    "@services/(.*)": "<rootDir>/src/services/$1",
    "@src/(.*)": "<rootDir>/src/$1",
    "@test/(.*)": "<rootDir>/test/$1",
    "@util/(.*)": "<rootDir>/src/util/$1",
  },
};

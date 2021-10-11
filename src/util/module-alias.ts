import moduleAlias from "module-alias";
import * as path from "path";

const files = path.resolve(__dirname, "../..");

moduleAlias.addAliases({
  "@clients": path.join(files, "src/clients"),
  "@controllers": path.join(files, "src/controllers"),
  "@fixtures": path.join(files, "test/fixtures"),
  "@middlewares": path.join(files, "src/middlewares"),
  "@models": path.join(files, "src/models"),
  "@services": path.join(files, "src/services"),
  "@src": path.join(files, "src"),
  "@test": path.join(files, "test"),
  "@util": path.join(files, "src/util"),
});

import AuthService from "@services/auth";
import logger from "@src/logger";
import { Document, Model, model, Query, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface User {
  nome: string;
  email: string;
  senha: string;
}

const schema = new Schema<User>(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    nome: { required: true, type: String },
    senha: { required: true, type: String },
  },
  {
    strict: "throw",
    timestamps: true,
    toJSON: {
      transform: (_doc, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.plugin(uniqueValidator, {
  message: "já existe no banco de dados",
  type: "DUPLICATED",
});

schema.path("senha").validate(
  async function (senha: string) {
    return senha.length >= 8;
  },
  "deve ter pelo menos 8 caracteres",
  "TOO SHORT"
);

schema.pre<User & Document>("save", async function (): Promise<void> {
  if (this.senha && this.isModified("senha")) {
    try {
      const hashedPassword = await AuthService.hashPassword(this.senha);
      this.senha = hashedPassword;
    } catch (error) {
      logger.error(`Error de hash na senha do Usuário ${this.nome}`);
    }
  }
});

schema.pre<Query<User, User>>("updateOne", async function (): Promise<void> {
  const senha = this.get("senha");

  if (senha) {
    try {
      const hashedPassword = await AuthService.hashPassword(senha);
      this.set("senha", hashedPassword);
    } catch (error) {
      logger.error("Error de hash na senha do Usuário");
    }
  }
});

export const User: Model<User> = model("User", schema);

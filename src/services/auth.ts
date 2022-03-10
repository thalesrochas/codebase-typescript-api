import { User } from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface DecodedUser extends User {
  readonly id: string;
}

/**
 * @classdesc Utilitários para autenticação com JWT e criptografia de senhas.
 */
export default class AuthService {
  /**
   * Criptografa uma senha.
   *
   * @async
   * @param {string} password Senha a ser criptografada
   * @param {number} [salt=10] Quantidade de rounds utilizado na criptografia
   * @returns {Promise<string>} Senha criptografada
   */
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compara se uma senha não criptografada corresponde a uma senha criptografada.
   *
   * @async
   * @param {string} password Senha
   * @param {string} hashedPassword Senha criptografada
   * @returns {Promise<boolean>} Resultado da comparação das senhas
   */
  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Gera um Token JWT com as informações passadas.
   *
   * @param {object} payload Objeto a ser embutido no JWT (geralmente são os dados de um usuário)
   * @returns {string} Token JWT
   */
  public static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  /**
   * Decodifica o Token JWT devolvendo os dados do payload informado na geração do Token.
   *
   * @param {string} token Token JWT
   * @returns {DecodedUser} Dados do Usuário a quem o Token pertence
   */
  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedUser;
  }
}

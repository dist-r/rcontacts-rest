import bcrypt from "bcrypt";

export class BcryptUtil {
  static SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(BcryptUtil.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isTrue = await bcrypt.compare(password, hashedPassword);
    return isTrue;
  }
}
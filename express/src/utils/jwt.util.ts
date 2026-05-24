import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

interface AccessTokenPayload {
  userId: string;
  email: string;
}

class JwtUtils {
  
  private static secretKey = process.env.JWT_SECRET as string || "testkey";

  private static accessTokenExpires: SignOptions["expiresIn"] = "15m";

  static generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.accessTokenExpires,
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.secretKey) as JwtPayload;
  }
}

export default JwtUtils;
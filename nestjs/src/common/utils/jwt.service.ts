import { Injectable } from "@nestjs/common";
import {sign, verify, decode, JwtPayload} from "jsonwebtoken";

interface AccessTokenPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtService {

  private readonly secret = process.env.JWT_SECRET as string || "testkey";

  generateAccessToken(payload: AccessTokenPayload): string {
    return sign(payload, this.secret, {
      expiresIn: "1h",
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return verify(token, this.secret) as JwtPayload;
  }

}
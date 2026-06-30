import { Injectable } from '@nestjs/common';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtService {
  private readonly secret = (process.env.JWT_SECRET as string) || 'testkey';

  generateAccessToken(payload: AccessTokenPayload): string {
    return sign(payload, this.secret, {
      expiresIn: '1h',
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return verify(token, this.secret) as AccessTokenPayload;
  }
}

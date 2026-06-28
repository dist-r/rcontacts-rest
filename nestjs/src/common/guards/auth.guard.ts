import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "../utils/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(context : ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
    throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Token is missing');
    }
    try {
      const payload = this.jwtService.verifyAccessToken(token);
      request.user = payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
    return true;
  }

}
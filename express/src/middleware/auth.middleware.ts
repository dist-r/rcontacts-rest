import { Request, Response, NextFunction } from "express";
import JwtUtils from "../utils/jwt.util";

class AuthMiddleware {
 
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = JwtUtils.verifyAccessToken(token);
      (req as any).userId = decoded.userId;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
    }
  } 
}

export default AuthMiddleware;
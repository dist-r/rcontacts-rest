import {sign , verify } from "hono/jwt"

type Payload = {
  id: number
  email: string
  exp?: number
}

export default class JwtUtils {

  private static secret = process.env.JWT_SECRET as string
  
  static async generateToken(id: number, email: string){
    const payload : Payload = {id, email, exp: Math.floor(Date.now() / 1000) + (60 * 60)}
    try {
      const token = await sign(payload, JwtUtils.secret)
      return token
    } catch (error) {
      throw error
    }
  }

  static async verifyToken(token: string){
    try {
      const payload = await verify(token, JwtUtils.secret)
      return payload as Payload
    } catch (error) {
      throw error
    }
  }
  
}
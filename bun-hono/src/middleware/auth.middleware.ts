import { Context, Next } from 'hono'
import JwtUtils from '../utils/jwt.utils'
import AppError from '../common/api.error'

export default class AuthMiddleware {
  static async authenticate(c: Context, next: Next) {

    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized')
    }
    const token = authHeader.split(' ')[1]
    try {
      const payload = await JwtUtils.verifyToken(token)
      if (!payload) {
        throw new AppError(401, 'Unauthorized')
      }
      c.set('userId', payload.id)
      c.set('email', payload.email)
      await next()
    } catch (err) {
      throw new AppError(401, 'Unauthorized')
    }
  }
}

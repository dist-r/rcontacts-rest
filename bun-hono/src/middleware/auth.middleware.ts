import { Context, Next } from 'hono'
import JwtUtils from '../utils/jwt.utils'
import { appLog } from '../config/logger.pino'

export default class AuthMiddleware {
  static async authenticate(c: Context, next: Next) {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ message: 'Unauthorized' }, 401)
    }
    const token = authHeader.split(' ')[1]
    try {
      const payload = await JwtUtils.verifyToken(token)
      if (!payload) {
        return c.json({ message: 'Unauthorized' }, 401)
      }
      appLog.debug("Auth Called")
      appLog.debug({payload})
      c.set('userId', payload.id)
      c.set('email', payload.email)
      await next()
    } catch (err) {
      return c.json({ message: 'Unauthorized' }, 401)
    }
  }
}

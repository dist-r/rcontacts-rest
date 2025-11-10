import AppError from "../../common/api.error";
import { Context} from "hono";
import { appLog } from "../../config/logger.pino";
import  UserService from "./user.service";

export default class UserController {

  constructor(private userService: UserService){}

  async register(c: Context) {
    const {username, name, email, password} = await c.req.json()
    if (!username || !name || !email || !password) {
      throw new AppError(400, "Missing required fields")
    }
    try {
      await this.userService.createUser(username, name, email, password)
      return c.json({message: "User register was successful"}, 201)
    } catch (error) {
      throw error
    }
  }

  async login(c: Context) {
    const {email, password} = await c.req.json()
    if(!email || !password){
      throw new AppError(400, "Missing required fields")
    }

    const response = await this.userService.loginUser(email, password)
    return c.json(response)
  }

  async profile(c: Context) {
    const userId = c.get("userId")
    appLog.debug({userId})
    try {
      const user = await this.userService.profileUser(userId)
      const {password, ...userWithoutPassword} = user
      return c.json(userWithoutPassword)
    } catch (error) {
      throw error
    }
  }

}
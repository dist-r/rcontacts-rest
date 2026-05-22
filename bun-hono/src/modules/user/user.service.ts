import UserRepository from "./user.respository";
import AppError from "../../common/api.error";
import JwtUtils from "../../utils/jwt.utils";
import HashUtils from "../../utils/hash.utils";
import ILogger from "../../config/logger/ilogger";
import { User } from "./user";

export default class UserService {
  
  constructor(private userRepository: UserRepository, private logger: ILogger) {}

  async createUser(username: string, name: string, email: string, password: string): Promise<Partial<User>> {

    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      this.logger.debug("Email already in use", { email })
      throw new AppError(400, "Email already in use")
    }

    const hashedPassword = await HashUtils.hashedPassword(password)
    const generateUUID = crypto.randomUUID()
    const user = await this.userRepository.create(generateUUID, username, name, email, hashedPassword)
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    }
  }

  async loginUser(email: string, password: string): Promise<string>{

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      this.logger.debug("User not found", { email })
      throw new AppError(404, "User not found")
    }
   
    const verify = await HashUtils.verifyPassword(user.password, password)
    if (!verify) {
      throw new AppError(401, "Invalid credentials")
    }

    const token = await JwtUtils.generateToken(user.id, user.email)
    return token
  }

  async profileUser (id: string) : Promise<Partial<User>> {
   
    const user = await this.userRepository.findByID(id)
    if (!user) {
      this.logger.debug("User not found", { id })
      throw new AppError(404, "User not found")
    }
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    }

  }
}
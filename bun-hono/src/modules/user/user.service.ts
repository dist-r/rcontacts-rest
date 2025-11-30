import UserRepository from "./user.respository";
import { ResponseLogin} from "./user";
import AppError from "../../common/api.error";
import JwtUtils from "../../utils/jwt.utils";
import HashUtils from "../../utils/hash.utils";
import { appLog } from "../../config/logger.pino";

export default class UserService {
  
  constructor(private userRepository: UserRepository) {}

  async createUser(username: string, name: string, email: string, password: string): Promise<void> {
    appLog.debug("Create user service called")
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new AppError(400, "User already exists")
    }
    const bcryptHash = await HashUtils.hashedPassword(password)
    await this.userRepository.create(username, name, email, bcryptHash)
  }

  async loginUser(email: string, password: string): Promise<ResponseLogin | Error>{

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError(404, "User not found")
    }
   
    const verify = await HashUtils.verifyPassword(user.password, password)
    if (!verify) {
      throw new AppError(401, "Invalid credentials")
    }

    const token = await JwtUtils.generateToken(user.id, user.email)
    return {token}  
  }

  async profileUser (id: string){
   try {
    const user = await this.userRepository.findByID(id)
    if (!user) {
      throw new AppError(404, "User not found")
    }
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    }
   } catch (error) {
    throw error
   }
  }
}
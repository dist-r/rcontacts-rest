import { User } from "./user";
import IUserRepository from "./user.repository";
import AppError from "../../shared/custom.error";
import ILogger from "../../config/log/ilogger";
import JwtUtils from "../../utils/jwt.util";
import BcyrptUtil from "../../utils/bcrypt.util";

class UserService {
  constructor(
    private userRepository: IUserRepository,
    private logger: ILogger
  ) {}

  async registerUser(username: string, name: string, email: string, password: string): Promise<Partial<User>> {

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }
    
    const hashedPassword = await BcyrptUtil.hashPassword(password);

    const result = await this.userRepository.createUser(username, name, email, hashedPassword);
    this.logger.info(`User registered with email: ${result.email}`);
    const newUser: Partial<User> = {
      id: result.id,
      username: result.username,
      name: result.name,
      email: result.email,
    }
    return newUser;
  }

  async loginUser(email: string, password: string): Promise<string> {
    
    const user = await this.userRepository.getUserByEmail(email);

    if(!user) {
      throw new AppError("User not found", 401);
    }

    const isPasswordValid = await BcyrptUtil.comparePassword(password, user.password);

    if(!isPasswordValid) {
      throw new AppError("Password invalid", 401);
    }

    const token = JwtUtils.generateAccessToken({ userId: user.id, email: user.email });
    return token;
  }

  async userProfile(id: string): Promise<Omit<User, "password"> | null> {
    return null;
  }
}

export default UserService;
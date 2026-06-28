import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { randomUUID } from "crypto";
import type IUserRepository from "./user.irepository";
import { CreateUserDto } from "./contract/dto/user.dto";
import { AppError } from "src/shared/app.error";
import { User } from "./contract/types/interface.user";
import { BcryptUtil } from "src/common/utils/bcrypt.utils";
import { JwtService } from "src/common/utils/jwt.service";
import { AuthGuard } from "src/common/guards/auth.guard";

@Injectable()
export class UserService {

  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async createUser(createUser: CreateUserDto): Promise<Omit<User, "password">> {
    
    const existingUser = await this.userRepository.findByEmail(createUser.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }
    const hashPassword = await BcryptUtil.hashPassword(createUser.password);
    const newUser: User = {
      id: randomUUID(),
      username: createUser.username,
      name: createUser.name,
      email: createUser.email,
      password: hashPassword
    };
    const saveUser = await this.userRepository.save(newUser);
    const response: Omit<User, "password"> = {
      id: saveUser.id,
      username: saveUser.username,
      name: saveUser.name,
      email: saveUser.email
    };
    return response;

  }

  async loginUser(email: string, password: string): Promise<string> {

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new AppError("User with this email does not exist", 404);
    }
    const isPasswordValid = await BcryptUtil.comparePassword(password, existingUser.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }
    const token = this.jwtService.generateAccessToken({ id: existingUser.id, email: existingUser.email });
    return token;

  }

  @UseGuards(AuthGuard)
  async profileUser(userId: string): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    const response: Omit<User, "password"> = {
      id: existingUser.id,
      username: existingUser.username,
      name: existingUser.name,
      email: existingUser.email
    };
    return response;
  }
}
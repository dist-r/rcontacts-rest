import { Controller, HttpCode,  Post, Body, ValidationPipe } from "@nestjs/common";
import { UserService } from "../users/user.service";
import type { CreateUserDto, LoginUserDto } from "../users/contract/dto/user.dto";
import { ApiResponse } from "src/shared/api.response";

@Controller("auth")
export class AuthController {

  constructor(private readonly userService: UserService) {}

  @Post("register")
  @HttpCode(201)
  async register(@Body(new ValidationPipe) createUserDto: CreateUserDto) { 

    const response = await this.userService.createUser(createUserDto);
    
    const apiResponse: ApiResponse<Omit<CreateUserDto, "password">> = {
      success: true,
      message: "User registered successfully",
      data: response
    };

    return apiResponse;
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body(new ValidationPipe) loginDto: LoginUserDto) {

    const token = await this.userService.loginUser(loginDto.email, loginDto.password);

    const apiResponse: ApiResponse<{token : string}> = {
      success: true,
      message: "User logged in successfully",
      data: { token }
    };

    return apiResponse;
  }
}
import AppError from "../../common/api.error";
import { Context} from "hono";
import  UserService from "./user.service";
import { RegisterResponse, LoginResponse, CreateUserDto, LoginUserDto, CreateUserSchema, LoginUserSchema, ProfileResponse } from "./user.dto";
import { ApiResponse } from "../../common/api.response";

export default class UserController {

  constructor(private userService: UserService) {}

  async register(c: Context){

    const {username, name, email, password} = await c.req.json()
    const parseReq = CreateUserSchema.parse({username, name, email, password})
    const result =await this.userService.createUser(parseReq.username, parseReq.name, parseReq.email, parseReq.password)
    const response : ApiResponse<RegisterResponse> = {
      message: "User registered successfully",
      success: true,
      data: {
        id: result.id!,
        username: result.username!,
        name: result.name!,
        email: result.email!
      }
    }
    c.status(201)
    return c.json(response)

  }

  async login(c: Context) {
   
    const {email, password} = await c.req.json()
    const parseReq = LoginUserSchema.parse({email, password})
    const response = await this.userService.loginUser(parseReq.email, parseReq.password)
    const apiResponse : ApiResponse<LoginResponse> = {
      message: "User logged in successfully",
      success: true,
      data: {
        token: response
      }
    }
    return c.json(apiResponse)

  }

  async profile(c: Context) {
    
    const userId = c.get("userId")
    if (!userId) {
      throw new AppError(401, "Unauthorized")
    }

    const result = await this.userService.profileUser(userId)
    const response: ApiResponse<ProfileResponse> = {
      message: "User profile retrieved successfully",
      success: true,
      data: {
        id: result.id!,
        username: result.username!,
        name: result.name!,
        email: result.email!
      }
    }
    return c.json(response)
  }
}

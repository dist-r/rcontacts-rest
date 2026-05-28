import UserService from "./user.service";
import { Request, Response } from "express";
import { CreateUserDto, CreateUserType, LoginUserResponseDto, LoginUserDto, LoginUserType} from "./user.dto";
import ApiResponse from "../../shared/api.response";
import { CreateUserResponseDto } from "./user.dto";
import { ProfileUserResponseDto } from "./user.dto";

class UserController {

  constructor(private userService: UserService) {}

  async registerUser(req: Request, res: Response): Promise<void> {

    const { username, name, email, password } : CreateUserDto = req.body;

    const parseResult: CreateUserDto = CreateUserType.parse({ username, name, email, password });

    const data = await this.userService.registerUser(parseResult.username, parseResult.name, parseResult.email, parseResult.password);

    const dataResponse: CreateUserResponseDto = {
      id: data.id as string,
      username: data.username as string,
      name: data.name as string,
      email: data.email as string,
    }

    const response : ApiResponse<CreateUserResponseDto> = {
      message: "User registered successfully",
      success: true,
      data: dataResponse,
    }

    res.status(201).json(response);
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    
    const { email, password } = req.body;

    const parseResult: LoginUserDto = LoginUserType.parse({ email, password });

    const token = await this.userService.loginUser(parseResult.email, parseResult.password);

    const dataResponse : LoginUserResponseDto = {
      token: token as string,
    }
    
    const response : ApiResponse<LoginUserResponseDto> = {
      message: "User logged in successfully",
      success: true,
      data: dataResponse,
    }

    res.status(200).json(response);
  }

  async profileUser(req: Request, res: Response): Promise<void> {

    const id = (req as any).userId as string;

    const data = await this.userService.userProfile(id);

    if(!data) {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    const dataResponse: ProfileUserResponseDto = {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
    }

    const response : ApiResponse<ProfileUserResponseDto> = {
      message: "User profile retrieved successfully",
      success: true,
      data: dataResponse,
    }

    res.status(200).json(response);
  }
}

export default UserController;
import { Controller, Get, HttpCode, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current.user';
import { AppError } from 'src/shared/app.error';
import { ApiResponse } from 'src/shared/api.response';
import { User } from './contract/types/interface.user';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @HttpCode(200)
  async getProfile(@CurrentUser() currentUser: any) {
    const userId = currentUser.id as string;
    if (!userId) {
      throw new AppError("User ID not found in request", 400);
    }
    const userProfile = await this.userService.profileUser(userId);
    
    const apiResponse: ApiResponse<Omit<User, "password">> = {
      success: true,
      message: "User profile retrieved successfully",
      data: userProfile
    };

    return apiResponse;
  }
}
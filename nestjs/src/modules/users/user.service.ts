import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  async getUserProfile() {
    return { message: "User profile data" };
  }
}
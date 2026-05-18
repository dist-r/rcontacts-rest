import { User } from "./user";

export default interface IUserRepository {
  createUser(username: string, name: string, email: string, hashedPassword: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
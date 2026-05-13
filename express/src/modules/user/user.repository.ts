import { User } from "./user";

export default interface IUserRepository {
  createUser(name: string, email: string, password: string): Promise<void | Error>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
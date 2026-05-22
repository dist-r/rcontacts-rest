import { User } from "./user";

export default interface IUserRepository {
  create(id: string, username: string, name: string, email: string, password: string) : Promise<User>
  findByID(id : string) : Promise<User | null> 
  findByEmail(email : String) : Promise<User | null>
}
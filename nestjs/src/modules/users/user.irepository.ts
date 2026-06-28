import { User } from "./contract/types/interface.user"

export default interface IUserRepository {
  save(user: User): Promise<User>
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
}
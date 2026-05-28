import UserRepository from "../../modules/user/user.respository";
import { User } from "../../modules/user/user";
import IUserRepository from "../../modules/user/user.respository";
class InMemoryUserRepository implements IUserRepository{
  users: User[]

  constructor() {
    this.users = []
  }

  async create(id: string, username: string, name: string, email: string, password: string): Promise<User> {
    // const id = crypto.randomUUID()
    const user = {
      id,
      username,
      name,
      email,
      password
    }
    this.users.push(user)
    return user;

  }

  async findByID(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id)
    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: String): Promise<User | null> {
    
    const user = this.users.find(user => user.email === email)
    if (!user) {
      return null
    }
    return user

  }
}

export default InMemoryUserRepository;
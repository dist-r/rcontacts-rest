import UserRepository from "../../modules/user/user.respository";
import { User } from "../../modules/user/user";

class InMemoryUserRepository implements UserRepository{
  users: User[]

  constructor() {
    this.users = []
  }

  async create(username: string, name: string, email: string, password: string): Promise<void> {
    
    const user = {
      id: this.users.length + 1,
      username,
      name,
      email,
      password
    }
    this.users.push(user)
  }

  async findByID(id: number): Promise<any | undefined> {
    return this.users.find(user => user.id === id)
  }

  async findByEmail(email: String): Promise<any | undefined> {
    return this.users.find(user => user.email === email)
  }
}

export default InMemoryUserRepository;
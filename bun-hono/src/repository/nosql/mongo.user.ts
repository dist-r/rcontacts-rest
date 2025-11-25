// repository/MongoUserRepository.ts
import { Db, Collection } from "mongodb";
import { User } from "../../modules/user/user";
import UserRepository from "../../modules/user/user.respository";

export default class MongoUserRepository implements UserRepository {

  private collection: Collection<User>;

  constructor(db: Db) {
    this.collection = db.collection("users");
  }

  async create(username: string, name: string, email: string, password: string): Promise<void> {
    const id = crypto.randomUUID(); // generate UUID
    const newUser: User = {
      id,
      username,
      name,
      email,
      password,
    };

    await this.collection.insertOne(newUser);
  }

  async findByID(id: string): Promise<User | undefined> {
    const doc = await this.collection.findOne({ id });
    if (!doc) return undefined;
    return doc;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const doc = await this.collection.findOne({ email });
    if (!doc) return undefined;
    return doc;
  }
}

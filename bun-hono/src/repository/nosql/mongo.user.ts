// repository/MongoUserRepository.ts
import { Db, Collection } from "mongodb";
import { User } from "../../modules/user/user";
import UserRepository from "../../modules/user/user.respository";

type UserDocument = {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
};


export default class MongoUserRepository implements UserRepository {

  private collection: Collection<UserDocument>;

  constructor(db: Db) {
    this.collection = db.collection("users");
  }

  async create(username: string, name: string, email: string, password: string): Promise<void> {
    const id = crypto.randomUUID(); 
    const newUser: UserDocument={
      _id: id,
      username,
      name,
      email,
      password,
    };

    await this.collection.insertOne(newUser);
  }

  async findByID(id: string): Promise<User | undefined> {
    const doc = await this.collection.findOne({ _id: id});
    if (!doc) return undefined;
    const user: User = {
      id: doc._id,
      username: doc.username,
      name: doc.name,
      email: doc.email,
      password: doc.password,
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const doc = await this.collection.findOne({ email });
    if (!doc) return undefined;
    const user: User = {
      id: doc._id,
      username: doc.username,
      name: doc.name,
      email: doc.email,
      password: doc.password
    }
    return user;
  }
}

// repository/MongoContactRepository.ts
import { Collection, Db } from "mongodb";
import ContactRepository from "../../modules/contact/contact.respository";
import Contact from "../../modules/contact/contact";

export default class MongoContactRepository implements ContactRepository {
  private collection: Collection<Contact>;

  constructor(db: Db) {
    this.collection = db.collection("contacts");
  }

  async create(name: string, email: string, phone: string, userId: string): Promise<void> {
    const id = crypto.randomUUID();
    const doc: Contact = { id, name, email, phone, userId };
    await this.collection.insertOne(doc);
  }

  async findByID(id: string): Promise<Contact | undefined> {
    const doc = await this.collection.findOne({ id });
    if (!doc) return undefined;
    return doc;
  }

  async findAll(userId: string): Promise<Contact[] | undefined> {
    const docs = await this.collection.find({ userId }).toArray();
    if (docs.length === 0) return undefined;
    return docs;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact | undefined> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: contact },
      { returnDocument: "after" } 
    );

    if (!result) return undefined;
    return result; 
  }



  async delete(id: string): Promise<void | undefined> {
    const result = await this.collection.deleteOne({ id });
    if (result.deletedCount === 0) return undefined;
  }
}

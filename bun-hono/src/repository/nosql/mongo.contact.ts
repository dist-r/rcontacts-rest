// repository/MongoContactRepository.ts
import { Collection, Db } from "mongodb";
import ContactRepository from "../../modules/contact/contact.respository";
import Contact from "../../modules/contact/contact";
import { appLog } from "../../config/logger.pino";

type ContactDocument = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
};

export default class MongoContactRepository implements ContactRepository {
  private collection: Collection<ContactDocument>;

  constructor(db: Db) {
    this.collection = db.collection("contacts");
  }

  async create(name: string, email: string, phone: string, userId: string): Promise<void> {
    const id = crypto.randomUUID();
    const doc: ContactDocument = { _id: id, name, email, phone, userId };
    await this.collection.insertOne(doc);
  }

  async findByID(id: string): Promise<Contact | undefined> {
    appLog.debug("Contact Repository: findByID called")
    appLog.debug({id})
    const doc = await this.collection.findOne({ _id: id});
    if (!doc) return undefined;
    const contact: Contact = {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      userId: doc.userId,
    };
    return contact;
  }

  async findAll(userId: string): Promise<Contact[] | undefined> {
    const docs = await this.collection.find({ userId }).toArray();
    if (docs.length === 0) return undefined;
    const contacts: Contact[] = docs.map((doc) => {
      return {
        id: doc._id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        userId: doc.userId,
      }
    })
    return contacts;
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact | undefined> {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: contact },
      { returnDocument: "after" } 
    );

    if (!result) return undefined;
    const updatedContact: Contact = {
      id: result._id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      userId: result.userId,
    }
    return updatedContact;
  }

  async delete(id: string): Promise<void | undefined> {
    const result = await this.collection.deleteOne({ _id: id});
    if (result.deletedCount === 0) return undefined;
  }
}

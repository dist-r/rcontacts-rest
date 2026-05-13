import { Contact } from "./contact";

export default interface IContactRepository {
  create(name: string, email: string, phone: string): Promise<void | Error>;
  update(id: string, name: string, email: string, phone: string): Promise<Contact | Error>;
  findById(id: string): Promise<Contact | null>;
  findAll(userId: string): Promise<Contact[] | null>;
  delete(id: string): Promise<void | Error>;
}
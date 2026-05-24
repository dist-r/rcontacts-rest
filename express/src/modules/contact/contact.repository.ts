import { Contact } from "./contact";

export default interface IContactRepository {
  create(userId: string, name: string, email: string, phone: string): Promise<Contact>;
  update(id: string, name: string, email: string, phone: string): Promise<Contact | null>;
  findById(id: string): Promise<Contact | null>;
  findAll(userId: string): Promise<Partial<Contact>[]>;
  delete(id: string): Promise<Contact> ;
}
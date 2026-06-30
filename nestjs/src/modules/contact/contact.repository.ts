import { Contact } from './contract/types/contact.type';

export default interface IContactRepository {
  getAll(userId: string): Promise<Contact[]>;
  create(contact: Contact): Promise<Contact>;
  findId(id: string): Promise<Contact | null>;
  update(contact: Partial<Contact>, id: string): Promise<Contact>;
  delete(id: string): Promise<Contact>;
}

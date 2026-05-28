import Contact from "./contact";

export default interface IContactRepository {
  create(name: string, email: string, phone: string, userId: string) : Promise<Contact>
  findByID(id : string) : Promise<Contact | null>
  findAll(userId : string) : Promise<Contact[]>
  update(id: string, contact : Partial<Contact>) : Promise<Contact>
  delete(id : string) : Promise<Contact>
}

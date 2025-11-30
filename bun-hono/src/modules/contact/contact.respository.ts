import Contact from "./contact";

export default interface ContactRepository {
  create(name: string, email: string, phone: string, userId: string) : Promise<void>
  findByID(id : string) : Promise<Contact | undefined>
  findAll(userId : string) : Promise<Contact[] | undefined>
  update(id: string, contact : Partial<Contact>) : Promise<Contact | undefined>
  delete(id : string) : Promise<void | undefined>
}
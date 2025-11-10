import Contact from "./contact";

export default interface ContactRepository {
  create(name: string, email: string, phone: string, userId: number) : Promise<Contact>
  findByID(id : number) : Promise<Contact | undefined>
  findAll(userId : number) : Promise<Contact[] | undefined>
  update(id: number, contact : Partial<Contact>) : Promise<Contact | undefined>
  delete(id : number) : Promise<void | undefined>
}
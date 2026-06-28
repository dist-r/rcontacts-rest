import { Injectable } from "@nestjs/common";
import IContactRepository from "./contact.repository";
import { PostgresService } from "src/common/database/raw/postgres.service";
import { Contact } from "./contract/types/contact.type";

@Injectable()
export default class PostgresContactRepository implements IContactRepository {

  constructor(private readonly pgService: PostgresService){}

  async create(contact: Contact ) : Promise<Contact>{
    const query = ``
    const param = [contact.id, contact.userId, contact.email, contact.phone]
    try {
      const result = await this.pgService.query(query, param)
      return result[0] as Contact
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {

    return await this.pgService.query("",[])
  }

  async delete(id: string): Promise<Contact> {
    return await this.pgService.query("",[])
  }

  async findId(id: string): Promise<Contact | null> {
    return await this.pgService.query("",[])
  }

  async getAll(userId: string): Promise<Contact[]> {
    return await this.pgService.query("",[])
  }
}
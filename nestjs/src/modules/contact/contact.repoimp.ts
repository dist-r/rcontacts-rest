import { Injectable } from "@nestjs/common";
import IContactRepository from "./contact.repository";
import { PostgresService } from "src/common/database/raw/postgres.service";
import { Contact } from "./contract/types/contact.type";

@Injectable()
export default class PostgresContactRepository implements IContactRepository {

  constructor(private readonly pgService: PostgresService){}

  async create(contact: Contact ) : Promise<Contact>{
    const query = `INSERT INTO contacts (id, user_id, name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const params = [contact.id, contact.userId, contact.name, contact.email, contact.phone]
    try {
      const result = await this.pgService.query(query, params)
      return result[0] as Contact
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  async update(contact: Partial<Contact>, id : string): Promise<Contact> {
    const query = `UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`;
    const params = [contact.name, contact.email, contact.phone, id]
    try {
      const result = await this.pgService.query(query, params);
      const contact : Contact = {
        id: result[0].id,
        userId: result[0].user_id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone
      }
      return contact
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async delete(id: string): Promise<Contact> {
    const query = `DELETE FROM contacts WHERE id = $1 RETURNING *`;
    const params = [id]
    try {
      const result = await this.pgService.query(query, params);
      return {
        id: result[0].id,
        userId: result[0].user_id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone
      }
    } catch (err){
      console.error(err)
      throw err
    }
  }

  async findId(id: string): Promise<Contact | null> {
    const query = `SELECT * FROM contacts WHERE id = $1`;
    const params = [id];
    try {
      const result = await this.pgService.query(query, params);
      if (result.length === 0){
        return null
      }
      return {
        id: result[0].id,
        userId: result[0].user_id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getAll(userId: string): Promise<Contact[]> {
    const query = `SELECT * FROM contacts WHERE user_id = $1`;
    const params = [userId];
    try {
      const result = await this.pgService.query(query, params);
      const contacts : Contact[] = result.map((contact: any) => {
        return {
          id: contact.id,
          userId: contact.user_id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone
        }
      });
      return contacts
    } catch (err){
      console.error(err)
      throw err
    }
  }
}
import { Injectable } from '@nestjs/common';
import IContactRepository from './contact.repository';
import { PostgresService } from 'src/common/database/raw/postgres.service';
import { Contact } from './contract/types/contact.type';

@Injectable()
export default class PostgresContactRepository implements IContactRepository {
  constructor(private readonly pgService: PostgresService) {}

  async create(contact: Contact): Promise<Contact> {
    const query = `INSERT INTO contacts (id, user_id, name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS "userId", name, email, phone`;
    const params = [
      contact.id,
      contact.userId,
      contact.name,
      contact.email,
      contact.phone,
    ];
    try {
      const result = await this.pgService.query<Contact>(query, params);
      return result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(contact: Partial<Contact>, id: string): Promise<Contact> {
    const query = `UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, user_id AS "userId", name, email, phone`;
    const params = [contact.name, contact.email, contact.phone, id];
    try {
      const result = await this.pgService.query<Contact>(query, params);
      const contact: Contact = {
        id: result[0].id,
        userId: result[0].userId,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
      };
      return contact;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: string): Promise<Contact> {
    const query = `DELETE FROM contacts WHERE id = $1 RETURNING id, user_id AS "userId", name, email, phone;`;
    const params = [id];
    try {
      const result = await this.pgService.query<Contact>(query, params);
      return {
        id: result[0].id,
        userId: result[0].userId,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findId(id: string): Promise<Contact | null> {
    const query = `SELECT * FROM contacts WHERE id = $1`;
    const params = [id];
    try {
      const result = await this.pgService.query<Contact>(query, params);
      if (result.length === 0) {
        return null;
      }
      return {
        id: result[0].id,
        userId: result[0].userId,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAll(userId: string): Promise<Contact[]> {
    const query = `SELECT id, user_id AS "userId", name, email, phone FROM contacts WHERE user_id = $1`;
    const params = [userId];
    try {
      const result = await this.pgService.query<Contact>(query, params);
      const contacts: Contact[] = result.map((contact: Contact) => {
        return {
          id: contact.id,
          userId: contact.userId,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
        };
      });
      return contacts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

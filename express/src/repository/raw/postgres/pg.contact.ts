import { Pool } from "pg";
import IContactRepository from "../../../modules/contact/contact.repository";
import { Contact } from "../../../modules/contact/contact";
import {randomUUID} from "crypto";
import ILogger from "../../../config/log/ilogger";

export default class PgContactRepository implements IContactRepository {

  constructor(
    private pool: Pool, 
    private logger: ILogger
  ) {}

  async create(userId: string, name: string, email: string, phone: string): Promise<Contact> {

    const id = randomUUID();
    try {
      const result = await this.pool.query(
        `INSERT INTO contacts (id, user_id, name, email, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, userId, name, email, phone]
      );

      return {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone
      };
    } catch (error) {
      this.logger.error("Error creating contact", error);
      throw error;
    }
  }

  async update(id: string, name: string, email: string, phone: string): Promise<Contact | null> {
    const result = await this.pool.query(
      `UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`,
      [name, email, phone, id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const contact : Contact = {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }

    return contact;

  }

  async findById(id: string): Promise<Contact | null> {
    let result;
    try {
      result = await this.pool.query(`SELECT * FROM contacts WHERE id = $1`, [id]);
    } catch (error) {
      this.logger.error("Error finding contact by ID", error);
      throw error;
    }

    if (result.rows.length === 0) {
      return null;
    }

    const contact : Contact = {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }

    return contact;
  }

  async findAll(userId : string): Promise<Partial<Contact>[] | null> {
    let result;
    try {
      result = await this.pool.query(`SELECT * FROM contacts WHERE user_id = $1`, [userId]);
    } catch (error) {
      this.logger.error("Error finding all contacts", error);
      throw error;
    }

    if (result.rows.length === 0) {
      return null;
    }

    const contacts : Partial<Contact>[] = [];
    result.rows.forEach((contact) => {
      contacts.push({
        id: contact.id,
        userId: contact.user_id,  
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      })
    });

    return contacts;
  }

  async delete(id: string): Promise<void> {
    try {
      await this.pool.query(`DELETE FROM contacts WHERE id = $1 RETURNING *`, [id]);
    } catch (error) {
      this.logger.error("Error deleting contact", error);
      throw error;
    }
    return;
  }
}
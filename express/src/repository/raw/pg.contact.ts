import { Pool } from "pg";
import IContactRepository from "../../modules/contact/contact.repository";
import { Contact } from "../../modules/contact/contact";
import {randomUUID} from "crypto";

export default class PgContactRepository implements IContactRepository {

  constructor(private pool: Pool) {}

  async create(name: string, email: string, phone: string): Promise<void | Error> {

    const id = randomUUID();
    const newContact : Contact = {
      id,
      name,
      email,
      phone
    }

    await this.pool.query(`INSERT INTO contacts (id, name, email, phone) VALUES ($1, $2, $3, $4)`, [
      newContact.id,
      newContact.name,
      newContact.email,
      newContact.phone
    ]);

    return;
  }

  async update(id: string, name: string, email: string, phone: string): Promise<Contact | Error> {
    const result = await this.pool.query(`UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`, [
      name,
      email,
      phone,
      id
    ]);

    if (result.rows.length === 0) {
      return new Error("Contact not found");
    }

    const updatedContact : Contact = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }

    return updatedContact;
  }

  async findById(id: string): Promise<Contact | null> {
    const result = await this.pool.query(`SELECT * FROM contacts WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const contact : Contact = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }

    return contact;
  }

  async findAll(userId : string): Promise<Contact[] | null> {
    const result = await this.pool.query(`SELECT * FROM contacts WHERE user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const contacts : Contact[] = [];
    result.rows.forEach((contact) => {
      contacts.push({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      })
    });

    return contacts;
  }

  async delete(id: string): Promise<void | Error> {
    const result = await this.pool.query(`DELETE FROM contacts WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return new Error("Contact not found");
    }

    return;
  }
}
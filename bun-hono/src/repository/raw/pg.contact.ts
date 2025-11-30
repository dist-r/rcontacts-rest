import { Pool } from "pg";
import ContactRepository from "../../modules/contact/contact.respository";
import Contact from "../../modules/contact/contact";
import { appLog } from "../../config/logger.pino";

class PostgresContactRepository implements ContactRepository{

  constructor(private db: Pool) {}

  async create(name: string, email: string, phone: string, userId: string): Promise<void> {
    const id = crypto.randomUUID()
    const newContact : Contact = {
      id,
      name,
      email,
      phone,
      userId
    }
    appLog.debug("Repository create Called")
    // appLog.debug({newContact})

    await this.db.query(`INSERT INTO contacts (id, name, email, phone, user_id) VALUES ($1, $2, $3, $4, $5)`, [
      newContact.id,
      newContact.name,
      newContact.email,
      newContact.phone,
      newContact.userId
    ]);
    return
  }

  async findByID(id: string): Promise<Contact | undefined> {
    const result = await this.db.query("SELECT * FROM contacts WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return undefined
    }
    const contact : Contact = {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }

    return contact
  }

  async findAll(userId: string): Promise<Contact[] | undefined> {
    const result = await this.db.query("SELECT * FROM contacts WHERE user_id = $1", [userId])
    if (result.rows.length === 0) {
      return undefined
    }
    const contacts : Contact[] = result.rows.map((contact) => {
      return {
        id: contact.id,
        userId: contact.user_id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      }
    })
    return contacts
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact | undefined> {
    const result = await this.db.query("UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *", [
      contact.name,
      contact.email,
      contact.phone,
      id
    ])
    if (result.rows.length === 0) {
      return undefined
    }
    const updatedContact : Contact = {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phone: result.rows[0].phone
    }
    return updatedContact
  }

  async delete(id: string): Promise<void |undefined> {
    const result = await this.db.query("DELETE FROM contacts WHERE id = $1 RETURNING *", [id])
    if (result.rows.length === 0) {
      return undefined
    }
    return;
  }
}

export default PostgresContactRepository;
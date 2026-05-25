import { Pool } from "pg";
import ContactRepository from "../../modules/contact/contact.respository";
import Contact from "../../modules/contact/contact";
import ILogger from "../../config/logger/ilogger";

class PostgresContactRepository implements ContactRepository{

  constructor(private db: Pool, private logger: ILogger) {}

  async create(name: string, email: string, phone: string, userId: string): Promise<Contact> {

    const id = crypto.randomUUID()
    const newContact : Contact = {
      id,
      name,
      email,
      phone,
      userId
    }
    this.logger.debug("Repository Contact create Called")

    try {

      const result = await this.db.query(`INSERT INTO contacts (id, name, email, phone, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
        newContact.id,
        newContact.name,
        newContact.email,
        newContact.phone,
        newContact.userId
      ]);

      const createdContact : Contact = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        userId: result.rows[0].user_id
      }

      this.logger.debug("Contact created successfully", { contactId: createdContact.id });
      return createdContact
    } catch (error) {
      this.logger.error("Error creating contact", { error });
      throw error;
    }

  }

  async findByID(id: string): Promise<Contact | null> {

    this.logger.debug("Finding contact by ID", { contactId: id });
    try {
      const result = await this.db.query("SELECT * FROM contacts WHERE id = $1", [id])
      if (result.rows.length === 0) {
        this.logger.debug("Contact not found", { contactId: id });
        return null
      }
      const contact : Contact = {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone
      }
      this.logger.debug("Contact found", { contactId: contact.id });
      return contact
    } catch (error) {
      this.logger.error("Error finding contact by ID", { contactId: id, error });
      throw error;
    }
  }

  async findAll(userId: string): Promise<Contact[]> {

    this.logger.debug("Finding all contacts for user", { userId });
    try {
      const result = await this.db.query("SELECT * FROM contacts WHERE user_id = $1", [userId])
      if (result.rows.length === 0) {
        this.logger.debug("No contacts found for user", { userId });
        return []
      }
      const contacts : Contact[] = result.rows.map((contact) => {
        return {
          id: contact.id,
          userId: contact.user_id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone
        }
      });
      this.logger.debug("Contacts found", { userId });
      return contacts;
    } catch (error) {
      this.logger.error("Error finding contacts for user", { userId, error });
      throw error; 
    }

  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {

    this.logger.debug("Updating contact", { contactId: id });
    try {
      const result = await this.db.query("UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *", [
        contact.name,
        contact.email,
        contact.phone,
        id
      ])
      const updatedContact : Contact = {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone
      }
      this.logger.debug("Contact updated successfully", { contactId: updatedContact.id });
      return updatedContact
    } catch (error) {
      this.logger.error("Error updating contact", { contactId: id, error });
      throw error;
    }

  }

  async delete(id: string): Promise<Contact> {

    this.logger.debug("Deleting contact", { contactId: id });
    try {
      const result = await this.db.query("DELETE FROM contacts WHERE id = $1 RETURNING *", [id])
      const deletedContact : Contact = {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone
      }
      this.logger.debug("Contact deleted successfully", { contactId: deletedContact.id });
      return deletedContact;
    } catch (error) {
      this.logger.error("Error deleting contact", { contactId: id, error });
      throw error;
    }

  }
}

export default PostgresContactRepository;
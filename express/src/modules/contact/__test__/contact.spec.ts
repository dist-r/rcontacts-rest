import { beforeEach, describe, expect, it, vi } from "vitest";
import ILogger from "../../../config/log/ilogger";
import ContactService from "../contact.service";
import { Contact } from "../contact";
import IContactRepository from "../contact.repository";

class InMemoryContactRepository implements IContactRepository {
  contacts: Contact[] = [];

  async create(userId: string, name: string, email: string, phone: string): Promise<Contact> {
    const contact: Contact = {
      id: crypto.randomUUID(),
      userId,
      name,
      email,
      phone,
    };

    this.contacts.push(contact);
    return contact;
  }

  async update(id: string, name: string, email: string, phone: string): Promise<Contact | null> {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
      return null;
    }

    this.contacts[index] = {
      ...this.contacts[index],
      name,
      email,
      phone,
    };

    return this.contacts[index];
  }

  async findById(id: string): Promise<Contact | null> {
    return this.contacts.find((contact) => contact.id === id) ?? null;
  }

  async findAll(userId: string): Promise<Contact[]> {
    return this.contacts.filter((contact) => contact.userId === userId);
  }

  async delete(id: string): Promise<Contact> {
    const contact = await this.findById(id);
    if (!contact) {
      throw new Error("Contact not found");
    }

    this.contacts = this.contacts.filter((item) => item.id !== id);
    return contact;
  }
}

describe("ContactService Unit Tests", () => {
  let contactRepo: InMemoryContactRepository;
  let contactService: ContactService;

  const logger: ILogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    contactRepo = new InMemoryContactRepository();
    contactService = new ContactService(contactRepo, logger);
  });

  it("createContact should create a new contact for a user", async () => {
    const contact = await contactService.createContact(
      "user-1",
      "Alice",
      "alice@mail.com",
      "08123456789",
    );

    expect(contact.id).toBeTypeOf("string");
    expect(contact).toMatchObject({
      userId: "user-1",
      name: "Alice",
      email: "alice@mail.com",
      phone: "08123456789",
    });
  });

  it("getAllContacts should return only contacts owned by the user", async () => {
    await contactService.createContact("user-1", "Alice", "alice@mail.com", "081111111");
    await contactService.createContact("user-1", "Bob", "bob@mail.com", "082222222");
    await contactService.createContact("user-2", "Charlie", "charlie@mail.com", "083333333");

    const contacts = await contactService.getAllContacts("user-1");

    expect(contacts).toHaveLength(2);
    expect(contacts.map((contact) => contact.name)).toEqual(["Alice", "Bob"]);
    expect(contacts.every((contact) => contact.userId === "user-1")).toBe(true);
  });

  it("getAllContacts should return empty array when user has no contacts", async () => {
    const contacts = await contactService.getAllContacts("user-unknown");

    expect(contacts).toEqual([]);
  });

  it("updateContact should update contact when it belongs to the user", async () => {
    const created = await contactService.createContact(
      "user-1",
      "Alice",
      "alice@mail.com",
      "08123456789",
    );

    const updated = await contactService.updateContact(
      created.id,
      "user-1",
      "Alice Updated",
      "alice-updated@mail.com",
      "08999999999",
    );

    expect(updated).toMatchObject({
      id: created.id,
      userId: "user-1",
      name: "Alice Updated",
      email: "alice-updated@mail.com",
      phone: "08999999999",
    });
  });

  it("updateContact should throw AppError when contact is not found", async () => {
    await expect(contactService.updateContact(
      "missing-id",
      "user-1",
      "New Name",
      "new@mail.com",
      "081111111",
    )).rejects.toThrow("Contact not found");
  });

  it("updateContact should throw AppError when contact belongs to another user", async () => {
    const created = await contactService.createContact(
      "user-1",
      "Alice",
      "alice@mail.com",
      "08123456789",
    );

    await expect(contactService.updateContact(
      created.id,
      "user-2",
      "Alice Updated",
      "alice-updated@mail.com",
      "08999999999",
    )).rejects.toThrow("Unauthorized");
  });

  it("deleteContact should delete contact when it belongs to the user", async () => {
    const created = await contactService.createContact(
      "user-1",
      "Alice",
      "alice@mail.com",
      "08123456789",
    );

    await contactService.deleteContact(created.id, "user-1");
    const contacts = await contactService.getAllContacts("user-1");

    expect(contacts).toEqual([]);
  });

  it("deleteContact should throw AppError when contact is not found", async () => {
    await expect(contactService.deleteContact("missing-id", "user-1"))
      .rejects.toThrow("Contact not found");
  });

  it("deleteContact should throw AppError when contact belongs to another user", async () => {
    const created = await contactService.createContact(
      "user-1",
      "Alice",
      "alice@mail.com",
      "08123456789",
    );

    await expect(contactService.deleteContact(created.id, "user-2"))
      .rejects.toThrow("Unauthorized");
  });
});

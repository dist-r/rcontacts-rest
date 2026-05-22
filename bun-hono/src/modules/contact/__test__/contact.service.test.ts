import { beforeEach, describe, expect, mock, test } from "bun:test";
import ILogger from "../../../config/logger/ilogger";
import InMemoryContactRepository from "../../../repository/inmemo/inMemo.contact";
import ContactService from "../contact.service";

describe("ContactService Unit Tests", () => {
  let contactRepo: InMemoryContactRepository;
  let contactService: ContactService;

  const logger: ILogger = {
    debug: mock(() => {}),
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
  };

  beforeEach(() => {
    contactRepo = new InMemoryContactRepository();
    contactService = new ContactService(contactRepo, logger);
  });

  test("createContact should create a new contact for a user", async () => {
    const contact = await contactService.createContact(
      "Alice",
      "alice@mail.com",
      "08123456789",
      "user-1",
    );

    expect(contact.id).toBeString();
    expect(contact).toMatchObject({
      name: "Alice",
      email: "alice@mail.com",
      phone: "08123456789",
      userId: "user-1",
    });
  });

  test("findAllContact should return only contacts owned by the user", async () => {
    await contactService.createContact("Alice", "alice@mail.com", "081111111", "user-1");
    await contactService.createContact("Bob", "bob@mail.com", "082222222", "user-1");
    await contactService.createContact("Charlie", "charlie@mail.com", "083333333", "user-2");

    const contacts = await contactService.findAllContact("user-1");

    expect(contacts).toHaveLength(2);
    expect(contacts.map((contact) => contact.name)).toEqual(["Alice", "Bob"]);
    expect(contacts.every((contact) => contact.userId === "user-1")).toBe(true);
  });

  test("findAllContact should return an empty array when user has no contacts", async () => {
    const contacts = await contactService.findAllContact("user-unknown");

    expect(contacts).toEqual([]);
  });

  test("updateContact should update a contact when it belongs to the user", async () => {
    const created = await contactService.createContact(
      "Alice",
      "alice@mail.com",
      "08123456789",
      "user-1",
    );

    const updated = await contactService.updateContact(created.id, "user-1", {
      name: "Alice Updated",
      phone: "08999999999",
    });

    expect(updated).toMatchObject({
      id: created.id,
      userId: "user-1",
      name: "Alice Updated",
      email: "alice@mail.com",
      phone: "08999999999",
    });
  });

  test("updateContact should throw AppError when contact is not found", async () => {
    expect(contactService.updateContact("missing-id", "user-1", { name: "New Name" }))
      .rejects.toThrow("Contact not found");
  });

  test("updateContact should throw AppError when contact belongs to another user", async () => {
    const created = await contactService.createContact(
      "Alice",
      "alice@mail.com",
      "08123456789",
      "user-1",
    );

    expect(contactService.updateContact(created.id, "user-2", { name: "Hacked" }))
      .rejects.toThrow("Forbidden");
  });

  test("deleteContact should delete and return the contact when it belongs to the user", async () => {
    const created = await contactService.createContact(
      "Alice",
      "alice@mail.com",
      "08123456789",
      "user-1",
    );

    const deleted = await contactService.deleteContact(created.id, "user-1");
    const contacts = await contactService.findAllContact("user-1");

    expect(deleted).toMatchObject(created);
    expect(contacts).toEqual([]);
  });

  test("deleteContact should throw AppError when contact is not found", async () => {
    expect(contactService.deleteContact("missing-id", "user-1"))
      .rejects.toThrow("Contact not found");
  });

  test("deleteContact should throw AppError when contact belongs to another user", async () => {
    const created = await contactService.createContact(
      "Alice",
      "alice@mail.com",
      "08123456789",
      "user-1",
    );

    expect(contactService.deleteContact(created.id, "user-2"))
      .rejects.toThrow("Forbidden");
  });
});

// import { describe, test, expect } from "bun:test";
// import ContactService from "../contact.service";
// import { MockContactRepo } from "./mock_repo";

// describe("ContactService unit tests", () => {
//   const service = new ContactService(new MockContactRepo());

//   test("createContact returns created contact", async () => {
//     const contact = await service.createContact("Alice", "alice@mail.com", "081234", 1);
//     expect(contact.name).toBe("Alice");
//   });

//   test("create Contact error exist user", async () => {
//     const contact = await service.createContact("Alice", "alice@mail.com", "081234", 2);
//     // expect(contact).toBe();
//   })

//   test("findAllContact returns contacts", async () => {
//     const contacts = await service.findAllContact(1);
//     expect(contacts.length).toBeGreaterThan(0);
//   });

//   test("deleteContact returns true if contact exists", async () => {
//     const result = await service.deleteContact(1);
//     expect(result).toBe(true);
//   });
// });

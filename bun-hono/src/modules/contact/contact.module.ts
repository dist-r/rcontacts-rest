import { Pool } from "pg";
import { Hono } from "hono";
import IContactRepository from "./contact.respository";
import ILogger from "../../config/logger/ilogger";
import PostgresContactRepository from "../../repository/raw/pg.contact";
import ContactService from "./contact.service";
import ContactController from "./contact.controller";
import AuthMiddleware from "../../middleware/auth.middleware";

type ContactModuleDependencies = {
  pool : Pool
  logger : ILogger
}

class ContactModule {

  static init(deps: ContactModuleDependencies): Hono {

    const app = new Hono();
    const urlApiContacts = "/contacts";
    const contactRepository: IContactRepository = new PostgresContactRepository(deps.pool, deps.logger);
    const contactService = new ContactService(contactRepository, deps.logger);
    const contactController = new ContactController(contactService, deps.logger);

    app.post(urlApiContacts, AuthMiddleware.authenticate, contactController.createContact.bind(contactController));
    app.get(urlApiContacts, AuthMiddleware.authenticate, contactController.findAllContact.bind(contactController));
    app.put(`${urlApiContacts}/:id`, AuthMiddleware.authenticate, contactController.updateContact.bind(contactController));
    app.delete(`${urlApiContacts}/:id`, AuthMiddleware.authenticate, contactController.deleteContact.bind(contactController));
    return app;

  }

}

export default ContactModule;
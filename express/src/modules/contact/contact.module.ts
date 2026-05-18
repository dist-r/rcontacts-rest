import { Router } from "express";

import ContactController from "./contact.controller";
import ContactService from "./contact.service";
import IContactRepository from "./contact.repository";
import PgContactRepository from "../../repository/raw/postgres/pg.contact";
import { Pool } from "pg";
import ILogger from "../../config/log/ilogger";
import AuthMiddleware from "../../middleware/auth.middleware";

type ContactModuleDependencies = {
  pool: Pool;
  logger: ILogger;
}

class ContactModule {

  static init (deps: ContactModuleDependencies): Router {

    const urlApiContacts = "/contacts";

    const contactRepository: IContactRepository = new PgContactRepository(deps.pool, deps.logger);
    const contactService = new ContactService(contactRepository, deps.logger);
    const contactController = new ContactController(contactService);

    const router = Router();

    router.post(urlApiContacts, AuthMiddleware.authenticate, contactController.createContact.bind(contactController));
    router.get(urlApiContacts, AuthMiddleware.authenticate, contactController.getAllContacts.bind(contactController));
    router.put(`${urlApiContacts}/:id`, AuthMiddleware.authenticate, contactController.updateContact.bind(contactController));
    router.delete(`${urlApiContacts}/:id`, AuthMiddleware.authenticate, contactController.deleteContact.bind(contactController));

    return router;
  } 
}

export default ContactModule;
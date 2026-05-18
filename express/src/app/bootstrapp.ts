import { Express } from "express";
import ILogger from "../config/log/ilogger";
import PinoLogger from "../config/log/pino/pino";
import PgDatabase from "../config/pg.raw.config";

import UserController from "../modules/user/user.controller";
import UserService from "../modules/user/user.service";
import IUserRepository from "../modules/user/user.repository";
import PgUserRepository from "../repository/raw/postgres/pg.user";

import ContactController from "../modules/contact/contact.controller";
import ContactService from "../modules/contact/contact.service";
import IContactRepository from "../modules/contact/contact.repository";
import PgContactRepository from "../repository/raw/postgres/pg.contact";

import AuthMiddleware from "../middleware/auth.middleware";


class Bootstrapp {

  static async init(app: Express) : Promise<void> {
    
    const logger: ILogger = new PinoLogger();
    const db = new PgDatabase();

    // User Module
    const userRepository: IUserRepository = new PgUserRepository(db.getPool(), logger);
    const userService: UserService = new UserService(userRepository, logger);
    const userController: UserController = new UserController(userService);

    // Contact Module
    const contactRepository: IContactRepository = new PgContactRepository(db.getPool(), logger);
    const contactService: ContactService = new ContactService(contactRepository, logger);
    const contactController: ContactController = new ContactController(contactService);

    // Register routes
    app.post("/api/register", (req, res) => userController.registerUser(req, res));
    app.post("/api/login", (req, res) => userController.loginUser(req, res));
    // app.get("/api/profile", AuthMiddleware.authenticate, (req, res) => userController.userProfile(req, res));

    app.post("/api/contacts", AuthMiddleware.authenticate, (req, res) => contactController.createContact(req, res));
    app.put("/api/contacts/:id", AuthMiddleware.authenticate, (req, res) => contactController.updateContact(req, res));
    app.delete("/api/contacts/:id", AuthMiddleware.authenticate, (req, res) => contactController.deleteContact(req, res));
    app.get("/api/contacts", AuthMiddleware.authenticate, (req, res) => contactController.getAllContacts(req, res));

  }
}

export default Bootstrapp;
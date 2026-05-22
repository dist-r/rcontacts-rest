import { Pool } from "pg";
import { Hono } from "hono";

import IUserRepository from "./user.respository";
import ILogger from "../../config/logger/ilogger";
import PostgresUserRepository from "../../repository/raw/pg.user";
import UserService from "./user.service";
import UserController from "./user.controller";
import AuthMiddleware from "../../middleware/auth.middleware";

type ContactModuleDependencies = {
  pool : Pool
  logger : ILogger
}


class UserModule {

  constructor(deps: ContactModuleDependencies){}

  static init(deps: ContactModuleDependencies): Hono {

    const app = new Hono();
    const userUrlApi = "/users";
    const authUrlApi = "/auth";

    const userRepository: IUserRepository = new PostgresUserRepository(deps.pool, deps.logger);
    const userService = new UserService(userRepository, deps.logger);
    const userController = new UserController(userService);

    app.post(`${authUrlApi}/register`, userController.register.bind(userController));
    app.post(`${authUrlApi}/login`, userController.login.bind(userController));
    app.get(`${userUrlApi}/profile`, AuthMiddleware.authenticate, userController.profile.bind(userController));

    return app;
  }
}

export default UserModule;
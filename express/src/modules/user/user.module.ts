import UserController from "./user.controller";
import UserService from "./user.service";
import IUserRepository from "./user.repository";
import PgUserRepository from "../../repository/raw/postgres/pg.user";
import { Pool } from "pg";
import ILogger from "../../config/log/ilogger";
import { Router } from "express";
import AuthMiddleware from "../../middleware/auth.middleware";

type UserModuleDependencies = {
  pool: Pool;
  logger: ILogger;
}

class UserModule {

  static init (deps: UserModuleDependencies): Router {

    const urlApiUsers = "/users";
    const urlApiAuth = "/auth";
    const userRepository: IUserRepository = new PgUserRepository(deps.pool, deps.logger);
    const userService = new UserService(userRepository, deps.logger);
    const userController = new UserController(userService);

    const router = Router();

    router.post(`${urlApiAuth}/register`, userController.registerUser.bind(userController));
    router.post(`${urlApiAuth}/login`, userController.loginUser.bind(userController));
    router.get(`${urlApiUsers}/profile`, AuthMiddleware.authenticate, userController.profileUser.bind(userController));

    return router;
  } 

}

export default UserModule;
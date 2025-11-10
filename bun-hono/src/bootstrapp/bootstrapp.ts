import { Context, Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import {logger} from "hono/logger"
import {cors} from "hono/cors"


import poolPg from "../config/postgres.raw";

import PostgresUserRepository from "../repository/raw/pg.user";
import PostgresContactRepository from "../repository/raw/pg.contact";

import UserController from "../modules/user/user.controller";
import ContactController from "../modules/contact/contact.controller";

import UserService  from "../modules/user/user.service";
import ContactService from "../modules/contact/contact.service";

import contactRoutes from "../routes/contact.routes";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";

import AppError from "../common/api.error";

function bootstrapp () {
  const app = new Hono()

  app.onError((err: Error, c: Context) => {
    let message = "Internal Server Error"
    let statusCode : StatusCode = 500
    if (err instanceof AppError) {
      message = err.message
      statusCode = err.statusCode
    }
    c.status(statusCode)
    return c.json({message})
  })

  // GLOBAL Middlewar
  app.use(logger())
  app.use(cors())
  
  // WIRING DEPENDENCY
  // REPO
  const userRepository = new PostgresUserRepository(poolPg)
  const contactRepository = new PostgresContactRepository(poolPg)

  // SERVICE
  const userService = new UserService(userRepository)
  const contactService = new ContactService(contactRepository)

  // CONTROLLER
  const userController = new UserController(userService)
  const contactController = new ContactController(contactService, userService)

  // ROUTING
  authRoutes(app, userController)
  userRoutes(app, userController)
  contactRoutes(app, contactController)

  return app
}

export default bootstrapp;

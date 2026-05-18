import router from "express";
import UserController from "../modules/user/user.controller";
import ContactController from "../modules/contact/contact.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const indexRouter = router.Router();
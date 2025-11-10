import AuthMiddleware from "../middleware/auth.middleware"
import { Hono } from "hono"
import ContactController from "../modules/contact/contact.controller"

export default function contactRoutes(app: Hono, contactController: ContactController){
 const contactRoutes = app.basePath("/api/v1/contacts")

 contactRoutes.use("*", AuthMiddleware.authenticate)
 contactRoutes.post("/", contactController.createContact.bind(contactController))
 contactRoutes.get("/", contactController.findAllContact.bind(contactController))
 contactRoutes.put("/:id", contactController.updateContact.bind(contactController))
 contactRoutes.delete("/:id", contactController.deleteContact.bind(contactController))
}
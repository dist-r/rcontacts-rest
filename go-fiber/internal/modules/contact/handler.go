package contact

import (
	"fmt"

	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/gofiber/fiber/v2"
)

type ContactHandler struct {
	service ContactService
}

func NewContactHandler(service ContactService) *ContactHandler {
	return &ContactHandler{service: service}
}

func (ch *ContactHandler) CreateContact(c *fiber.Ctx) error {
	ctx := c.UserContext()
	contact := &Contact{}
	userId := c.Locals("userID").(string)
	fmt.Println(userId)
	contact.UserID = userId
	if err := c.BodyParser(contact); err != nil {
		return err
	}

	result, err := ch.service.CreateContact(ctx, contact)
	if err != nil {
		return err
	}

	response := app.APIResponse[Contact]{
		Success: true,
		Message: "Contact created successfully",
		Data:    *result,
	}
	return c.Status(201).JSON(response)

}

func (ch *ContactHandler) GetAllContacts(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok {
		return fiber.ErrUnauthorized
	}
	ctx := c.UserContext()
	contacts, err := ch.service.FindAllContact(ctx, userID)
	if err != nil {
		return err
	}

	response := app.APIResponse[[]*Contact]{
		Success: true,
		Message: "Contacts fetched successfully",
		Data:    contacts,
	}
	return c.Status(200).JSON(response)
}

func (ch *ContactHandler) UpdateContact(c *fiber.Ctx) error {
	ctx := c.UserContext()
	contactId := c.Params("id")

	contact := &Contact{}
	contact.ID = contactId
	if err := c.BodyParser(contact); err != nil {
		return err
	}

	result, err := ch.service.UpdateContact(ctx, contact)
	if err != nil {
		return err
	}

	response := app.APIResponse[Contact]{
		Success: true,
		Message: "Contact updated successfully",
		Data:    *result,
	}
	return c.Status(200).JSON(response)
}

func (ch *ContactHandler) DeleteContact(c *fiber.Ctx) error {
	contactId := c.Params("id")
	ctx := c.UserContext()
	err := ch.service.DeleteContact(ctx, contactId)
	if err != nil {
		return err
	}

	response := app.APIResponse[any]{
		Success: true,
		Message: "Contact deleted successfully",
		Data:    nil,
	}
	return c.Status(200).JSON(response)
}

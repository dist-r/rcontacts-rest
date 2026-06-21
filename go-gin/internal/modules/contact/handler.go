package contact

import (
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
	"github.com/gin-gonic/gin"
)

type ContactHandler struct {
	service *ContactService
}

func NewContactHandler(service *ContactService) *ContactHandler {
	return &ContactHandler{service: service}
}

func (h *ContactHandler) GetAllContacts(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(app.NewError(401, "User ID not found in context"))
		return
	}

	contacts, err := h.service.FindAllContacts(c.Request.Context(), userID.(string))
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(200, app.APIResponse[[]*Contact]{
		Success: true,
		Message: "Success",
		Data:    &contacts,
	})
}

// func (h *ContactHandler) GetContact(c *gin.Context) {
// 	contactId := c.Param("id")

func (h *ContactHandler) CreateContact(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(app.NewError(401, "User ID not found in context"))
		return
	}

	var contact CreateContactDto
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.Error(err)
		return
	}

	newContact := CreateContactDto{
		Name:  contact.Name,
		Email: contact.Email,
		Phone: contact.Phone,
	}

	result, err := h.service.CreateContact(c.Request.Context(), &newContact, userID.(string))
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, app.APIResponse[*Contact]{
		Success: true,
		Message: "Success",
		Data:    &result,
	})

}

func (h *ContactHandler) UpdateContact(c *gin.Context) {
	contactId := c.Param("id")
	if contactId == "" {
		c.Error(app.NewError(400, "Contact ID is required"))
		return
	}

	var contact UpdateContactDto
	if err := c.ShouldBindJSON(&contact); err != nil {
		c.Error(err)
		return
	}

	updateContact := UpdateContactDto{
		ID:     contactId,
		Name:   contact.Name,
		Email:  contact.Email,
		Phone:  contact.Phone,
		UserID: contact.UserID,
	}

	result, err := h.service.UpdateContact(c.Request.Context(), &updateContact)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, app.APIResponse[*Contact]{
		Success: true,
		Message: "Success",
		Data:    &result,
	})

}

func (h *ContactHandler) DeleteContact(c *gin.Context) {

}

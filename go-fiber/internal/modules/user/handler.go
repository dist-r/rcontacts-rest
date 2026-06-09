package user

import (
	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/auth"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	us UserService
}

func NewUserHandler(us UserService) *UserHandler {
	return &UserHandler{us: us}
}

func (uh *UserHandler) RegisterUser(c *fiber.Ctx) error {
	ctx := c.UserContext()
	registerDto := auth.RegisterRequest{}
	user := &User{}
	if err := c.BodyParser(&registerDto); err != nil {
		return err
	}
	user.Username = registerDto.Username
	user.Name = registerDto.Name
	user.Email = registerDto.Email
	user.Password = registerDto.Password
	data, err := uh.us.RegisterUser(ctx, user)
	if err != nil {
		return err
	}
	response := app.APIResponse[UserResult]{
		Success: true,
		Message: "user registered successfully",
		Data:    *data,
	}
	c.Status(201)
	return c.JSON(response)
}

func (uh *UserHandler) LoginUser(c *fiber.Ctx) error {
	ctx := c.UserContext()
	loginDto := auth.LoginRequest{}
	if err := c.BodyParser(&loginDto); err != nil {
		return err
	}
	token, err := uh.us.LoginUser(ctx, loginDto.Email, loginDto.Password)
	if err != nil {
		return err
	}
	c.Status(200)
	response := app.APIResponse[auth.LoginResponse]{
		Success: true,
		Message: "user logged in successfully",
		Data:    auth.LoginResponse{Token: token},
	}
	return c.JSON(response)
}

func (uh *UserHandler) GetUserProfile(c *fiber.Ctx) error {
	ctx := c.UserContext()
	userID := c.Locals("userID").(string)
	user, err := uh.us.GetUserProfile(ctx, userID)
	if err != nil {
		return err
	}
	response := app.APIResponse[UserResult]{
		Success: true,
		Message: "user profile retrieved successfully",
		Data:    *user,
	}
	c.Status(200)
	return c.JSON(response)
}

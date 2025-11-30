package user

import (
	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/auth"
	"github.com/gofiber/fiber/v2"

	"context"
)

type UserHandler struct {
	us UserService
}

func NewUserHandler(us UserService) *UserHandler {
	return &UserHandler{us: us}
}

func (uh *UserHandler) RegisterUser(c *fiber.Ctx) error {
	ctx := context.Background()
	registerDto := auth.RegisterRequest{}
	user := &User{}

	if err := c.BodyParser(&registerDto); err != nil {
		return err
	}

	user.Username = registerDto.Username
	user.Name = registerDto.Name
	user.Email = registerDto.Email
	user.Password = registerDto.Password

	if err := uh.us.RegisterUser(ctx, user); err != nil {
		return err
	}
	c.Status(201)
	return c.JSON(auth.RegisterResponse{Message: "user registered successfully"})
}

func (uh *UserHandler) LoginUser(c *fiber.Ctx) error {
	ctx := context.Background()
	loginDto := auth.LoginRequest{}

	if err := c.BodyParser(&loginDto); err != nil {
		return err
	}

	token, err := uh.us.LoginUser(ctx, loginDto.Email, loginDto.Password)
	if err != nil {
		return err
	}
	c.Status(200)
	return c.JSON(auth.LoginResponse{Token: token})
}

func (uh *UserHandler) GetUserProfile(c *fiber.Ctx) error {
	ctx := context.Background()
	userID := c.Locals("userID").(string)

	user, err := uh.us.GetUserProfile(ctx, userID)
	if err != nil {
		return err
	}
	userWithoutPassword := struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Name     string `json:"name"`
		Email    string `json:"email"`
	}{
		ID:       user.ID,
		Username: user.Username,
		Name:     user.Name,
		Email:    user.Email,
	}
	c.Status(200)
	return c.JSON(userWithoutPassword)
}

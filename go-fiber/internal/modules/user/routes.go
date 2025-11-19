package user

import "github.com/gofiber/fiber/v2"

func UserRoutes(r fiber.Router, h *UserHandler) {
	r.Post("/auth/register", h.RegisterUser)
	r.Post("/auth/login", h.LoginUser)
	// r.Get("/users/profile", h.GetUserProfile)
}

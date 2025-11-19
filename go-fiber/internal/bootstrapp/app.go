package bootstrapp

import (
	"errors"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/user"
	"github.com/dist-r/rcontacts-rest/go-fiber/internal/repository/raw"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func SetupApp() {
	config.InitDB()
	godotenv.Load()
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {

			// Defualt Err
			code := fiber.StatusInternalServerError
			message := "Internal Server Error"
			// Custom Err
			var appErr *app.AppError
			if ok := errors.As(err, &appErr); ok {
				code = appErr.Code
				message = appErr.Msg
			}

			// Fiber err
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
				message = e.Message
			}

			return c.Status(code).JSON(fiber.Map{
				"code":    code,
				"message": message,
			})
		},
	})

	// GLOBAL MIDDLEWARES
	// CORS
	app.Use(cors.New(
		cors.Config{
			AllowOrigins: "*",
			AllowHeaders: "*",
			AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		},
	))

	// LOG
	app.Use(logger.New())

	// RECOVERY
	app.Use(recover.New())

	// WIRING DEPENDENCIES
	dbraw := raw.NewPGRawUserRepository(config.DB)
	userService := user.NewUserService(dbraw)
	userHandler := user.NewUserHandler(*userService)

	// REGISTER ROUTES
	userRoutes := app.Group("/api/v1")
	user.UserRoutes(userRoutes, userHandler)

	app.Listen(":3000")
}

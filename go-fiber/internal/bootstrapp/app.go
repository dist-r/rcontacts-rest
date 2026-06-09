package bootstrapp

import (
	"errors"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/contact"
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
	godotenv.Load()
	config.InitDB()

	logConfig := app.NewLogConfig()
	appLogger := app.InitLogger(logConfig)
	appLogger.Info("Logger initialized", "level", logConfig.Level.String(), "format", logConfig.Format)

	// Create Fiber App
	fiberApp := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Default Err
			code := fiber.StatusInternalServerError
			message := "Internal Server Error"

			// Custom Err
			var appErr *app.AppError
			if ok := errors.As(err, &appErr); ok {
				code = appErr.Code
				message = appErr.Msg
				appLogger.Error("Application error occurred",
					"code", code,
					"message", message,
					"path", c.Path(),
					"method", c.Method(),
				)
			}

			// Fiber err
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
				message = e.Message
			}

			response := app.APIResponse[any]{
				Success: false,
				Message: message,
				Data:    nil,
			}

			appLogger.Error(err.Error(),
				"code", code,
				"message", message,
				"path", c.Path(),
				"method", c.Method(),
			)
			return c.Status(code).JSON(response)
		},
	})

	// GLOBAL MIDDLEWARES
	// CORS
	fiberApp.Use(cors.New(
		cors.Config{
			AllowOrigins: "*",
			AllowHeaders: "*",
			AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		},
	))

	// LOG
	fiberApp.Use(logger.New())

	// RECOVERY
	fiberApp.Use(recover.New())

	// WIRING DEPENDENCIES
	appLogger.Info("Starting dependency injection")

	// USER
	dbUser := raw.NewPGRawUserRepository(config.DB, appLogger)
	userService := user.NewUserService(dbUser, appLogger)
	userHandler := user.NewUserHandler(*userService)
	appLogger.Debug("User dependencies initialized")

	// CONTACT
	dbContact := raw.NewPGRawContactRepository(config.DB, appLogger)
	contactService := contact.NewContactService(dbContact, appLogger)
	contactHandler := contact.NewContactHandler(*contactService)
	appLogger.Debug("Contact dependencies initialized")

	// REGISTER ROUTES
	appLogger.Info("Registering API routes")
	rootRoutes := fiberApp.Group("/api/v2")
	user.UserRoutes(rootRoutes, userHandler)
	contact.ContactRoutes(rootRoutes, contactHandler)

	if err := fiberApp.Listen(":3000"); err != nil {
		appLogger.Error("Server error", "error", err.Error())
		panic(err)
	}
}

package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/dist-r/rcontacts-rest/go-gin/internal/modules/contact"
	"github.com/dist-r/rcontacts-rest/go-gin/internal/modules/user"
	"github.com/dist-r/rcontacts-rest/go-gin/internal/repo"
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/config"
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/middleware"
	"github.com/gin-contrib/cors"
)

func main() {
	godotenv.Load()

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"*"},
		AllowHeaders: []string{"*"},
	}))
	r.Use(gin.Logger())

	r.Use(middleware.ErrorMiddleware())

	// MySqlDb
	mySqlDb, err := config.NewMySQLDB()
	if err != nil {
		panic(err)
	}
	defer mySqlDb.Close()

	// WRING DEPENDENCY

	// USER MODULE

	// USE IMPLMENTATION REPOSITORY
	userRepo := repo.NewMySQLRawUserRepository(mySqlDb)

	// SERVICE
	userService := user.NewUserService(userRepo)

	// HANDLER
	userHandler := user.NewUserHandler(userService)

	// CONTACT MODULE

	// USE IMPLMENTATION REPOSITORY
	contactRepo := repo.NewMySQLRawContactRepository(mySqlDb)

	// SERVICE
	contactService := contact.NewContactService(contactRepo)

	// HANDLER
	contactHandler := contact.NewContactHandler(contactService)

	// ROUTES
	api := r.Group("api/v2")

	auth := api.Group("auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
	}

	user := api.Group("users")
	{
		user.Use(middleware.AuthMiddleware())
		user.GET("/profile", userHandler.GetProfile)
	}

	contact := api.Group("contacts")
	{
		contact.Use(middleware.AuthMiddleware())
		contact.POST("/", contactHandler.CreateContact)
		contact.GET("/", contactHandler.GetAllContacts)
		// contact.GET("/:id", contactHandler.GetContactById)
		contact.PUT("/:id", contactHandler.UpdateContact)
		contact.DELETE("/:id", contactHandler.DeleteContact)
	}

	r.Run(":3000")
}

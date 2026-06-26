package user

import (
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (uh *UserHandler) Register(c *gin.Context) {
	var req RegisterDto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}
	result, err := uh.service.Register(c.Request.Context(), &req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, app.APIResponse[RegisterDataRes]{
		Success: true,
		Message: "User registered successfully",
		Data:    result,
	})
}

func (uh *UserHandler) Login(c *gin.Context) {
	var req LoginDto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	result, err := uh.service.Login(c.Request.Context(), &req)
	if err != nil {
		c.Error(err)
		return
	}

	loginData := LoginDataRes{
		Token: result,
	}

	c.JSON(200, app.APIResponse[LoginDataRes]{
		Success: true,
		Message: "User logged in successfully",
		Data:    &loginData,
	})
}

func (uh *UserHandler) GetProfile(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.Error(app.NewError(401, "User ID not found in context"))
		return
	}

	result, err := uh.service.Profile(c.Request.Context(), userId.(string))
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, app.APIResponse[ProfileDataRes]{
		Success: true,
		Message: "Profile retrieved successfully",
		Data:    result,
	})
}

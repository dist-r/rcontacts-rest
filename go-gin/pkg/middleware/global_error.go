package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
)

func ErrorMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		// Run next middleware / handler
		c.Next()

		// No error
		if len(c.Errors) == 0 {
			return
		}

		// Get last error
		err := c.Errors.Last().Err

		// Business Error
		var appErr *app.AppError
		if errors.As(err, &appErr) {

			c.AbortWithStatusJSON(appErr.Code, app.APIResponse[any]{
				Success: false,
				Message: appErr.Msg,
				Data:    nil,
			})

			return
		}

		// Unknown Error
		c.AbortWithStatusJSON(http.StatusInternalServerError, app.APIResponse[any]{
			Success: false,
			Message: "Internal Server Error",
			Data:    nil,
		})
	}
}

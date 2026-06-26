package middleware

import (
	"strings"

	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Error(app.NewError(401, "Unauthorized"))
			return
		}

		// Extract token (assuming "Bearer <token>")
		token := authHeader[len("Bearer "):]
		if token == "" {
			c.Error(app.NewError(401, "Invalid authorization header"))
			return
		}

		// Check if token starts with "Bearer "
		if !strings.HasPrefix(token, "Bearer ") {
			c.Error(app.NewError(401, "Invalid authorization header"))
			return
		}

		// Remove "Bearer " prefix
		token = strings.TrimPrefix(token, "Bearer ")

		// Verify token and get userId from claims
		claims, err := utils.VerifyToken(token)
		if err != nil {
			c.Error(err)
			return
		}

		// Set user ID in context
		c.Set("user_id", claims.UserID)

		c.Next()
	}
}

package utils

import (
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

var secretAccess = []byte(os.Getenv("JWT_SECRET"))

// var secretRefresh = []byte(os.Getenv("JWT_SECRET_REFRESH"))

// ACCESSS TOKEN
func GenerateToken(userId int, email string) (string, error) {
	claims := &Claims{
		UserID: userId,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretAccess)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(token string) (*Claims, error) {
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(token, claims, keyFunc)

	if err != nil {
		if strings.Contains(err.Error(), "expired") {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Token expired")
		} else if strings.Contains(err.Error(), "invalid") {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	if !tkn.Valid {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
	}

	return claims, nil
}

func keyFunc(token *jwt.Token) (any, error) {
	return secretAccess, nil
}

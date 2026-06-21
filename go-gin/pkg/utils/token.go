package utils

import (
	"errors"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

var secretAccess = []byte(os.Getenv("JWT_SECRET"))

var (
	ErrTokenExpired = errors.New("token expired")
	ErrInvalidToken = errors.New("invalid token")
	ErrUnauthorized = errors.New("unauthorized")
)

func GenerateToken(userID string, email string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(secretAccess)
}

func VerifyToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, keyFunc)
	if err != nil {
		if strings.Contains(err.Error(), "expired") {
			return nil, ErrTokenExpired
		}

		if strings.Contains(err.Error(), "invalid") {
			return nil, ErrInvalidToken
		}

		return nil, ErrUnauthorized
	}

	if !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

func keyFunc(token *jwt.Token) (any, error) {
	return secretAccess, nil
}

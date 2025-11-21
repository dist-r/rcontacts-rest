package user

import (
	"context"
	// "errors"
	"testing"
)

func TestRegisterUser_Success(t *testing.T) {
	mockRepo := &MockUserRepository{

		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, nil
		},
		CreateUserFunc: func(ctx context.Context, user *User) error {
			return nil
		},
	}

	service := NewUserService(mockRepo)

	err := service.RegisterUser(context.Background(), &User{
		Username: "bayu",
		Email:    "bayu@mail.com",
		Password: "123",
	})

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestRegisterUser_UserExists(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return &User{ID: 1, Email: email}, nil
		},
	}

	service := NewUserService(mockRepo)

	err := service.RegisterUser(context.Background(), &User{
		Email: "mail@mail.com",
	})

	if err == nil {
		t.Fatal("expected error user exists, got nil")
	}
}

package user

import (
	"context"
	"errors"
	"testing"

	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/utils"
)

// MockILogger is a mock implementation of ILogger for testing
type MockILogger struct{}

func (m *MockILogger) Debug(msg string, attrs ...any) {}
func (m *MockILogger) Info(msg string, attrs ...any)  {}
func (m *MockILogger) Warn(msg string, attrs ...any)  {}
func (m *MockILogger) Error(msg string, attrs ...any) {}

// ========== RegisterUser Tests ==========

func TestRegisterUser_Success(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, nil
		},
		CreateUserFunc: func(ctx context.Context, user *User) (*User, error) {
			user.ID = "user-123"
			return user, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.RegisterUser(context.Background(), &User{
		Username: "bayu",
		Name:     "Bayu Pratama",
		Email:    "bayu@mail.com",
		Password: "password123",
	})

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result == nil {
		t.Fatalf("expected result not nil")
	}

	if result.ID != "user-123" {
		t.Fatalf("expected ID 'user-123', got %s", result.ID)
	}

	if result.Username != "bayu" {
		t.Fatalf("expected username 'bayu', got %s", result.Username)
	}

	if result.Email != "bayu@mail.com" {
		t.Fatalf("expected email 'bayu@mail.com', got %s", result.Email)
	}
}

func TestRegisterUser_UserExists(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return &User{ID: "user-12", Email: email, Username: "bayu"}, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.RegisterUser(context.Background(), &User{
		Username: "bayu",
		Email:    "bayu@mail.com",
		Password: "password123",
	})

	if err == nil {
		t.Fatalf("expected error user exists, got nil")
	}

	if result != nil {
		t.Fatalf("expected result nil, got %v", result)
	}
}

func TestRegisterUser_GetUserByEmailError(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.RegisterUser(context.Background(), &User{
		Username: "bayu",
		Email:    "bayu@mail.com",
		Password: "password123",
	})

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if result != nil {
		t.Fatalf("expected result nil, got %v", result)
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

func TestRegisterUser_CreateUserError(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, nil
		},
		CreateUserFunc: func(ctx context.Context, user *User) (*User, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.RegisterUser(context.Background(), &User{
		Username: "bayu",
		Email:    "bayu@mail.com",
		Password: "password123",
	})

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if result != nil {
		t.Fatalf("expected result nil, got %v", result)
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

// ========== LoginUser Tests ==========

func TestLoginUser_Success(t *testing.T) {
	hashedPassword, _ := utils.Hashed("password123")

	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return &User{
				ID:       "user-123",
				Username: "bayu",
				Email:    email,
				Password: hashedPassword,
			}, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	token, err := service.LoginUser(context.Background(), "bayu@mail.com", "password123")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if token == "" {
		t.Fatalf("expected token not empty, got empty string")
	}
}

func TestLoginUser_UserNotFound(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	token, err := service.LoginUser(context.Background(), "notfound@mail.com", "password123")

	if err == nil {
		t.Fatalf("expected error user not found, got nil")
	}

	if token != "" {
		t.Fatalf("expected token empty, got %s", token)
	}
}

func TestLoginUser_InvalidPassword(t *testing.T) {
	hashedPassword, _ := utils.Hashed("password123")

	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return &User{
				ID:       "user-123",
				Username: "bayu",
				Email:    email,
				Password: hashedPassword,
			}, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	token, err := service.LoginUser(context.Background(), "bayu@mail.com", "wrongpassword")

	if err == nil {
		t.Fatalf("expected error invalid credentials, got nil")
	}

	if token != "" {
		t.Fatalf("expected token empty, got %s", token)
	}
}

func TestLoginUser_GetUserByEmailError(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByEmailFunc: func(ctx context.Context, email string) (*User, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	token, err := service.LoginUser(context.Background(), "bayu@mail.com", "password123")

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if token != "" {
		t.Fatalf("expected token empty, got %s", token)
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

// ========== GetUserProfile Tests ==========

func TestGetUserProfile_Success(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByIDFunc: func(ctx context.Context, id string) (*User, error) {
			return &User{
				ID:       id,
				Username: "bayu",
				Name:     "Bayu Pratama",
				Email:    "bayu@mail.com",
				Password: "hashedpassword",
			}, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.GetUserProfile(context.Background(), "user-123")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result == nil {
		t.Fatalf("expected result not nil")
	}

	if result.ID != "user-123" {
		t.Fatalf("expected ID 'user-123', got %s", result.ID)
	}

	if result.Username != "bayu" {
		t.Fatalf("expected username 'bayu', got %s", result.Username)
	}

	if result.Email != "bayu@mail.com" {
		t.Fatalf("expected email 'bayu@mail.com', got %s", result.Email)
	}

	if result.Name != "Bayu Pratama" {
		t.Fatalf("expected name 'Bayu Pratama', got %s", result.Name)
	}
}

func TestGetUserProfile_UserNotFound(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByIDFunc: func(ctx context.Context, id string) (*User, error) {
			return nil, nil
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.GetUserProfile(context.Background(), "user-999")

	if err == nil {
		t.Fatalf("expected error user not found, got nil")
	}

	if result != nil {
		t.Fatalf("expected result nil, got %v", result)
	}
}

func TestGetUserProfile_GetUserByIDError(t *testing.T) {
	mockRepo := &MockUserRepository{
		GetUserByIDFunc: func(ctx context.Context, id string) (*User, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewUserService(mockRepo, log)

	result, err := service.GetUserProfile(context.Background(), "user-123")

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if result != nil {
		t.Fatalf("expected result nil, got %v", result)
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

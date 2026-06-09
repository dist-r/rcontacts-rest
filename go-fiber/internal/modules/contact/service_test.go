package contact

import (
	"context"
	"errors"
	"testing"
)

// MockILogger is a mock implementation of ILogger for testing
type MockILogger struct{}

func (m *MockILogger) Debug(msg string, attrs ...any) {}
func (m *MockILogger) Info(msg string, attrs ...any)  {}
func (m *MockILogger) Warn(msg string, attrs ...any)  {}
func (m *MockILogger) Error(msg string, attrs ...any) {}

func TestCreateContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		CreateContactFunc: func(ctx context.Context, c *Contact) (*Contact, error) {
			c.ID = "1"
			c.UserID = "user123"
			return c, nil
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	result, err := service.CreateContact(context.Background(), &Contact{
		Name:  "Bayu",
		Email: "bayu@mail.com",
		Phone: "0895678949498",
	})

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if result == nil {
		t.Fatalf("expected result not nil, got nil")
	}

	if result.Name != "Bayu" {
		t.Fatalf("expected name 'Bayu', got %s", result.Name)
	}

	if result.Email != "bayu@mail.com" {
		t.Fatalf("expected email 'bayu@mail.com', got %s", result.Email)
	}
}

func TestCreateContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		CreateContactFunc: func(ctx context.Context, c *Contact) (*Contact, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	result, err := service.CreateContact(context.Background(), &Contact{
		Name:  "Test",
		Email: "test@mail.com",
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

func TestFindAllContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		GetAllContactsByUserIDFunc: func(ctx context.Context, userID string) ([]*Contact, error) {
			return []*Contact{
				{ID: "1", UserID: "user123", Name: "Bayu", Email: "bayu@mail.com", Phone: "08956789494"},
				{ID: "2", UserID: "user123", Name: "Jeni", Email: "jeni@mail.com", Phone: "08956789495"},
			}, nil
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	contacts, err := service.FindAllContact(context.Background(), "user123")

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if contacts == nil {
		t.Fatalf("expected contacts not nil")
	}

	if len(contacts) != 2 {
		t.Fatalf("expected 2 contacts, got %d", len(contacts))
	}

	if contacts[0].Name != "Bayu" {
		t.Fatalf("expected first contact name 'Bayu', got %s", contacts[0].Name)
	}

	if contacts[1].Name != "Jeni" {
		t.Fatalf("expected second contact name 'Jeni', got %s", contacts[1].Name)
	}
}

func TestFindAllContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		GetAllContactsByUserIDFunc: func(ctx context.Context, userID string) ([]*Contact, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	contacts, err := service.FindAllContact(context.Background(), "user123")

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if contacts != nil {
		t.Fatalf("expected contacts nil, got %v", contacts)
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

func TestUpdateContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		UpdateContactFunc: func(ctx context.Context, c *Contact) (*Contact, error) {
			c.ID = "1"
			c.UserID = "user123"
			return c, nil
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	updatedContact := &Contact{
		Name:  "Updated Bayu",
		Email: "updated@mail.com",
		Phone: "08956789498",
	}

	result, err := service.UpdateContact(context.Background(), updatedContact)

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if result == nil {
		t.Fatalf("expected result not nil")
	}

	if result.Name != "Updated Bayu" {
		t.Fatalf("expected name 'Updated Bayu', got %s", result.Name)
	}
}

func TestUpdateContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		UpdateContactFunc: func(ctx context.Context, c *Contact) (*Contact, error) {
			return nil, errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	result, err := service.UpdateContact(context.Background(), &Contact{
		ID: "1",
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

func TestDeleteContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		DeleteContactFunc: func(ctx context.Context, id string) error {
			return nil
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	err := service.DeleteContact(context.Background(), "contact-123")

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
}

func TestDeleteContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		DeleteContactFunc: func(ctx context.Context, id string) error {
			return errors.New("database error")
		},
	}

	log := &MockILogger{}
	service := NewContactService(mockRepo, log)

	err := service.DeleteContact(context.Background(), "contact-123")

	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if err.Error() != "database error" {
		t.Fatalf("expected 'database error', got %v", err)
	}
}

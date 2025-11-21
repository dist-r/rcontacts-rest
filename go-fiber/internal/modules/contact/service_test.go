package contact

import (
	"context"
	"errors"
	"testing"
)

func TestCreateContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		CreateContactFunc: func(ctx context.Context, c *Contact) error {
			return nil
		},
	}

	service := NewContactService(mockRepo)

	err := service.CreateContact(context.Background(), &Contact{
		Name:  "Bayu",
		Email: "bayu@mail.com",
		Phone: "0895678949498",
	})

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
}

func TestCreateContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		CreateContactFunc: func(ctx context.Context, c *Contact) error {
			return errors.New("DB error")
		},
	}

	service := NewContactService(mockRepo)

	err := service.CreateContact(context.Background(), &Contact{})

	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}

func TestFindAllContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		GetAllContactsByUserIDFunc: func(ctx context.Context, userID int) ([]*Contact, error) {
			return []*Contact{
				{ID: 1, Name: "Bayu", Email: "bayu@mail.com"},
				{ID: 2, Name: "Jeni", Email: "jeni@mail.com"},
			}, nil
		},
	}

	service := NewContactService(mockRepo)

	contacts, err := service.FindAllContact(context.Background(), 1)

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if len(contacts) != 2 {
		t.Fatalf("expected 2 contacts, got %d", len(contacts))
	}
}

func TestFindAllContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		GetAllContactsByUserIDFunc: func(ctx context.Context, userID int) ([]*Contact, error) {
			return nil, errors.New("DB error")
		},
	}

	service := NewContactService(mockRepo)

	_, err := service.FindAllContact(context.Background(), 1)

	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}

func TestUpdateContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		UpdateContactFunc: func(ctx context.Context, c *Contact) error {
			return nil
		},
	}

	service := NewContactService(mockRepo)

	err := service.UpdateContact(context.Background(), &Contact{})

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
}

func TestUpdateContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		UpdateContactFunc: func(ctx context.Context, c *Contact) error {
			return errors.New("DB error")
		},
	}

	service := NewContactService(mockRepo)

	err := service.UpdateContact(context.Background(), &Contact{})

	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}

func TestDeleteContact_Success(t *testing.T) {
	mockRepo := &MockContactRepository{
		DeleteContactFunc: func(ctx context.Context, id int) error {
			return nil
		},
	}

	service := NewContactService(mockRepo)

	err := service.DeleteContact(context.Background(), 1)

	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
}

func TestDeleteContact_Error(t *testing.T) {
	mockRepo := &MockContactRepository{
		DeleteContactFunc: func(ctx context.Context, id int) error {
			return errors.New("DB error")
		},
	}

	service := NewContactService(mockRepo)

	err := service.DeleteContact(context.Background(), 1)

	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}

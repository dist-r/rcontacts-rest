package contact

import "context"

type MockContactRepository struct {
	CreateContactFunc          func(ctx context.Context, c *Contact) error
	GetContactByIDFunc         func(ctx context.Context, id int) (*Contact, error)
	GetAllContactsByUserIDFunc func(ctx context.Context, userID int) ([]*Contact, error)
	UpdateContactFunc          func(ctx context.Context, c *Contact) error
	DeleteContactFunc          func(ctx context.Context, id int) error
}

func (m *MockContactRepository) CreateContact(ctx context.Context, c *Contact) error {
	return m.CreateContactFunc(ctx, c)
}

func (m *MockContactRepository) GetContactByID(ctx context.Context, id int) (*Contact, error) {
	return m.GetContactByIDFunc(ctx, id)
}

func (m *MockContactRepository) GetAllContactsByUserID(ctx context.Context, userID int) ([]*Contact, error) {
	return m.GetAllContactsByUserIDFunc(ctx, userID)
}

func (m *MockContactRepository) UpdateContact(ctx context.Context, c *Contact) error {
	return m.UpdateContactFunc(ctx, c)
}

func (m *MockContactRepository) DeleteContact(ctx context.Context, id int) error {
	return m.DeleteContactFunc(ctx, id)
}

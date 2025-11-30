package contact

import "context"

type ContactRepository interface {
	CreateContact(ctx context.Context, act *Contact) error
	GetContactByID(ctx context.Context, id string) (*Contact, error)
	GetAllContactsByUserID(ctx context.Context, userID string) ([]*Contact, error)
	UpdateContact(ctx context.Context, contact *Contact) error
	DeleteContact(ctx context.Context, id string) error
}

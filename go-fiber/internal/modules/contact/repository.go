package contact

import "context"

type ContactRepository interface {
	CreateContact(ctx context.Context, act *Contact) error
	GetContactByID(ctx context.Context, id int) (*Contact, error)
	GetAllContactsByUserID(ctx context.Context, userID int) ([]*Contact, error)
	UpdateContact(ctx context.Context, contact *Contact) error
	DeleteContact(ctx context.Context, id int) error
}

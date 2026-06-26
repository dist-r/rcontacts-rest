package contact

import "context"

type ContactRepository interface {
	GetAll(ctx context.Context, userID string) ([]*Contact, error)
	FindById(ctx context.Context, id string) (*Contact, error)
	FindByEmail(ctx context.Context, email string) (*Contact, error)
	Save(ctx context.Context, contact *Contact) (*Contact, error)
	Update(ctx context.Context, contact *Contact) (*Contact, error)
	Delete(ctx context.Context, id string) error
}

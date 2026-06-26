package contact

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
	"github.com/google/uuid"
)

type ContactService struct {
	repo ContactRepository
}

func NewContactService(repo ContactRepository) *ContactService {
	return &ContactService{
		repo: repo,
	}
}

func (cs *ContactService) CreateContact(ctx context.Context, data *CreateContactDto, userId string) (*Contact, error) {
	newContact := &Contact{
		ID:     uuid.New().String(),
		UserID: userId,
		Name:   data.Name,
		Email:  data.Email,
		Phone:  data.Phone,
	}
	result, err := cs.repo.Save(ctx, newContact)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (cs *ContactService) UpdateContact(ctx context.Context, data *UpdateContactDto) (*Contact, error) {
	contact, err := cs.repo.FindById(ctx, data.ID)
	if err != nil {
		return nil, err
	}
	if contact == nil {
		return nil, app.NewError(404, "Contact not found")
	}
	newContactData := &Contact{
		ID:    contact.ID,
		Name:  data.Name,
		Email: data.Email,
		Phone: data.Phone,
	}
	result, err := cs.repo.Update(ctx, newContactData)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (cs *ContactService) DeleteContact(ctx context.Context, id string) error {
	contact, err := cs.repo.FindById(ctx, id)
	if err != nil {
		return err
	}
	if contact == nil {
		return app.NewError(404, "Contact not found")
	}
	return cs.repo.Delete(ctx, contact.ID)
}

func (cs *ContactService) FindAllContacts(ctx context.Context, userID string) ([]*Contact, error) {
	contacts, err := cs.repo.GetAll(ctx, userID)
	if err != nil {
		return nil, err
	}
	return contacts, nil
}

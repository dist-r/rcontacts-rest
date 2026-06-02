package contact

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
)

type ContactService struct {
	repo ContactRepository
	log  app.ILogger
}

func NewContactService(repo ContactRepository, log app.ILogger) *ContactService {
	return &ContactService{repo: repo, log: log}
}

func (cs *ContactService) CreateContact(ctx context.Context, contact *Contact) (*Contact, error) {
	result, err := cs.repo.CreateContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	cs.log.Debug("Create Contact was Succesfully", "contact", DataContactLogger{
		ID:     result.ID,
		UserID: result.UserID,
		Name:   result.Name,
		Email:  result.Email,
		Phone:  result.Phone,
	})
	return result, nil
}

func (cs *ContactService) FindAllContact(ctx context.Context, userID string) ([]*Contact, error) {
	contacts, err := cs.repo.GetAllContactsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	logData := make([]DataContactLogger, len(contacts))
	for i, c := range contacts {
		logData[i] = DataContactLogger{
			ID:     c.ID,
			UserID: c.UserID,
			Name:   c.Name,
			Email:  c.Email,
			Phone:  c.Phone,
		}
	}
	cs.log.Debug("Fetch All Contact was Succesfully", "contacts", logData)
	return contacts, nil
}

func (cs *ContactService) UpdateContact(ctx context.Context, contact *Contact) (*Contact, error) {
	result, err := cs.repo.UpdateContact(ctx, contact)
	if err != nil {
		return nil, err
	}
	cs.log.Debug("Update Contact was Succesfully", "contact", DataContactLogger{
		ID:     result.ID,
		UserID: result.UserID,
		Name:   result.Name,
		Email:  result.Email,
		Phone:  result.Phone,
	})
	return result, nil
}

func (cs *ContactService) DeleteContact(ctx context.Context, id string) error {
	err := cs.repo.DeleteContact(ctx, id)
	if err != nil {
		return err
	}
	return nil
}

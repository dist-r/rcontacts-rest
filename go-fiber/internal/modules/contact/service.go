package contact

import "context"

type ContactService struct {
	repo ContactRepository
}

func NewContactService(repo ContactRepository) *ContactService {
	return &ContactService{repo: repo}
}

func (cs *ContactService) CreateContact(ctx context.Context, contact *Contact) error {
	err := cs.repo.CreateContact(ctx, contact)
	if err != nil {
		return err
	}
	return nil
}

func (cs *ContactService) FindAllContact(ctx context.Context, userID string) ([]*Contact, error) {
	contacts, err := cs.repo.GetAllContactsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return contacts, nil
}

func (cs *ContactService) UpdateContact(ctx context.Context, contact *Contact) error {
	err := cs.repo.UpdateContact(ctx, contact)
	if err != nil {
		return err
	}
	return nil
}

func (cs *ContactService) DeleteContact(ctx context.Context, id string) error {
	err := cs.repo.DeleteContact(ctx, id)
	if err != nil {
		return err
	}
	return nil
}

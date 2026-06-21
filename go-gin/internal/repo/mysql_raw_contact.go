package repo

import (
	"context"
	"database/sql"

	"github.com/dist-r/rcontacts-rest/go-gin/internal/modules/contact"
)

type MySQLRawContactRepository struct {
	db *sql.DB
}

func NewMySQLRawContactRepository(db *sql.DB) contact.ContactRepository {
	return &MySQLRawContactRepository{db: db}
}

func (r *MySQLRawContactRepository) FindById(ctx context.Context, id string) (*contact.Contact, error) {
	query := `
		SELECT id, name, email, phone
		FROM contacts
		WHERE id = ?
	`
	var contact contact.Contact
	err := r.db.QueryRowContext(ctx, query, id).Scan(&contact.ID, &contact.Name, &contact.Email, &contact.Phone)
	if err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *MySQLRawContactRepository) FindByEmail(ctx context.Context, email string) (*contact.Contact, error) {
	query := `
		SELECT id, name, email, phone
		FROM contacts
		WHERE email = ?
	`
	var contact contact.Contact
	err := r.db.QueryRowContext(ctx, query, email).Scan(&contact.ID, &contact.Name, &contact.Email, &contact.Phone)
	if err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *MySQLRawContactRepository) Save(ctx context.Context, contact *contact.Contact) (*contact.Contact, error) {
	query := `
		INSERT INTO contacts (id, name, email, phone)
		VALUES (?, ?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query, contact.ID, contact.Name, contact.Email, contact.Phone)
	if err != nil {
		return nil, err
	}
	return r.FindById(ctx, contact.ID)
}

func (r *MySQLRawContactRepository) Update(ctx context.Context, contact *contact.Contact) (*contact.Contact, error) {
	query := `
		UPDATE contacts
		SET name = ?, email = ?, phone = ?
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query, contact.Name, contact.Email, contact.Phone, contact.ID)
	if err != nil {
		return nil, err
	}
	return r.FindById(ctx, contact.ID)
}

func (r *MySQLRawContactRepository) Delete(ctx context.Context, id string) error {
	query := `
		DELETE FROM contacts
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *MySQLRawContactRepository) GetAll(ctx context.Context, userID string) ([]*contact.Contact, error) {
	query := `
		SELECT id, user_id, name, email, phone
		FROM contacts
		WHERE user_id = ?
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contacts []*contact.Contact
	for rows.Next() {
		var contact contact.Contact
		err := rows.Scan(&contact.ID, &contact.UserID, &contact.Name, &contact.Email, &contact.Phone)
		if err != nil {
			return nil, err
		}
		contacts = append(contacts, &contact)
	}
	return contacts, nil
}

package raw

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/contact"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PGRawContactRepository struct {
	db  *pgxpool.Pool
	log app.ILogger
}

func NewPGRawContactRepository(db *pgxpool.Pool, log app.ILogger) contact.ContactRepository {
	return &PGRawContactRepository{db: db, log: log}
}

func (r *PGRawContactRepository) CreateContact(ctx context.Context, c *contact.Contact) (*contact.Contact, error) {
	c.ID = uuid.New().String()
	contactResult := &contact.Contact{}
	err := r.db.QueryRow(ctx,
		`INSERT INTO contacts (id, user_id, name, email, phone) 
				 VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, email, phone`,
		c.ID, c.UserID, c.Name, c.Email, c.Phone,
	).Scan(&contactResult.ID, &contactResult.UserID, &contactResult.Name, &contactResult.Email, &contactResult.Phone)
	if err != nil {
		r.log.Error("Error creating contact", err)
		return nil, err
	}
	return contactResult, nil
}

func (r *PGRawContactRepository) GetContactByID(ctx context.Context, id string) (*contact.Contact, error) {
	c := &contact.Contact{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, name, email, phone
         FROM contacts WHERE id=$1`,
		id,
	).Scan(&c.ID, &c.UserID, &c.Name, &c.Email, &c.Phone)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return c, err
}

func (r *PGRawContactRepository) GetAllContactsByUserID(ctx context.Context, userID string) ([]*contact.Contact, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, user_id, name, email, phone
         FROM contacts WHERE user_id=$1`,
		userID,
	)
	if err != nil {
		r.log.Error("Error fetching contacts", err)
		return nil, err
	}
	defer rows.Close()

	contacts := []*contact.Contact{}

	for rows.Next() {
		c := &contact.Contact{}
		if err := rows.Scan(&c.ID, &c.UserID, &c.Name, &c.Email, &c.Phone); err != nil {
			return nil, err
		}
		contacts = append(contacts, c)
	}
	return contacts, nil
}

func (r *PGRawContactRepository) UpdateContact(ctx context.Context, c *contact.Contact) (*contact.Contact, error) {
	contactResult := &contact.Contact{}
	err := r.db.QueryRow(ctx,
		`UPDATE contacts
         SET name=$1, email=$2, phone=$3
         WHERE id=$4
         RETURNING id, user_id, name, email, phone`,
		c.Name, c.Email, c.Phone, c.ID,
	).Scan(&contactResult.ID, &contactResult.UserID, &contactResult.Name, &contactResult.Email, &contactResult.Phone)

	if err != nil {
		r.log.Error("Error updating contact", err)
		return nil, err
	}
	return contactResult, nil
}

func (r *PGRawContactRepository) DeleteContact(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx,
		`DELETE FROM contacts WHERE id=$1`,
		id,
	)
	if err != nil {
		r.log.Error("Error deleting contact", err)
		return err
	}
	return nil
}

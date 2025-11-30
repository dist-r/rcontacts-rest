package raw

import (
	"context"
	"fmt"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/contact"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PGRawContactRepository struct {
	db *pgxpool.Pool
}

func NewPGRawContactRepository(db *pgxpool.Pool) contact.ContactRepository {
	return &PGRawContactRepository{db: db}
}

func (r *PGRawContactRepository) CreateContact(ctx context.Context, c *contact.Contact) error {
	c.ID = uuid.New().String()
	_, err := r.db.Exec(ctx,
		`INSERT INTO contacts (id, user_id, name, email, phone)
         VALUES ($1, $2, $3, $4, $5)`,
		c.ID, c.UserID, c.Name, c.Email, c.Phone,
	)
	return err
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

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return contacts, nil
}

func (r *PGRawContactRepository) UpdateContact(ctx context.Context, c *contact.Contact) error {
	tag, err := r.db.Exec(ctx,
		`UPDATE contacts
         SET name=$1, email=$2, phone=$3
         WHERE id=$4`,
		c.Name, c.Email, c.Phone, c.ID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("contact not found")
	}
	return nil
}

func (r *PGRawContactRepository) DeleteContact(ctx context.Context, id string) error {
	tag, err := r.db.Exec(ctx,
		`DELETE FROM contacts WHERE id=$1`,
		id,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("contact not found")
	}
	return nil
}

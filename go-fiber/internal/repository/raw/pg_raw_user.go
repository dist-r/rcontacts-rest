package raw

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/user"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PGRawUserRepository struct {
	db *pgxpool.Pool
}

func NewPGRawUserRepository(db *pgxpool.Pool) user.UserRepository {
	return &PGRawUserRepository{db: db}
}

func (r *PGRawUserRepository) CreateUser(ctx context.Context, u *user.User) error {
	u.ID = uuid.New().String()
	_, err := r.db.Exec(ctx,
		`INSERT INTO users (id, username, name, email, password) 
         VALUES ($1, $2, $3, $4, $5)`,
		u.ID, u.Username, u.Name, u.Email, u.Password,
	)
	return err
}

func (r *PGRawUserRepository) GetUserByID(ctx context.Context, id string) (*user.User, error) {
	u := &user.User{}

	err := r.db.QueryRow(ctx,
		`SELECT id, username, name, email, password 
         FROM users WHERE id=$1`,
		id,
	).Scan(&u.ID, &u.Username, &u.Name, &u.Email, &u.Password)

	if err != nil {
		return nil, err
	}

	return u, nil
}

func (r *PGRawUserRepository) GetUserByEmail(ctx context.Context, email string) (*user.User, error) {
	u := &user.User{}

	err := r.db.QueryRow(ctx,
		`SELECT id, username, name, email, password 
         FROM users WHERE email=$1`,
		email,
	).Scan(&u.ID, &u.Username, &u.Name, &u.Email, &u.Password)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return u, nil
}

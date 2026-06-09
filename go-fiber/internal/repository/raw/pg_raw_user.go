package raw

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/internal/modules/user"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PGRawUserRepository struct {
	db  *pgxpool.Pool
	log app.ILogger
}

func NewPGRawUserRepository(db *pgxpool.Pool, log app.ILogger) user.UserRepository {
	return &PGRawUserRepository{db: db, log: log}
}

func (r *PGRawUserRepository) CreateUser(ctx context.Context, u *user.User) (*user.User, error) {
	u.ID = uuid.New().String()
	r.log.Debug("Creating user", "user", user.DataLoggerUser{ID: u.ID, Username: u.Username, Name: u.Name, Email: u.Email})
	user, err := r.db.Exec(ctx,
		`INSERT INTO users (id, username, name, email, password) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, username, name, email, password`,
		u.ID, u.Username, u.Name, u.Email, u.Password,
	)
	if err != nil {
		r.log.Error("Error occurred while creating user", err)
		return nil, err
	}
	if user.RowsAffected() == 0 {
		return nil, nil
	}
	return u, nil
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

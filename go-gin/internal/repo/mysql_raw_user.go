package repo

import (
	"context"
	"database/sql"

	"github.com/dist-r/rcontacts-rest/go-gin/internal/modules/user"
)

type MySQLRawUserRepository struct {
	db *sql.DB
}

func NewMySQLRawUserRepository(db *sql.DB) user.UserRepository {
	return &MySQLRawUserRepository{db: db}
}

func (r *MySQLRawUserRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	query := `
		SELECT id, username, name, email, password
		FROM users
		WHERE id = ?
	`
	var user user.User
	err := r.db.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Username, &user.Name, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *MySQLRawUserRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	query := `
		SELECT id, username, name, email, password
		FROM users
		WHERE email = ?
	`
	var user user.User
	err := r.db.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Username, &user.Name, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *MySQLRawUserRepository) Save(ctx context.Context, user *user.User) (*user.User, error) {
	query := `
		INSERT INTO users (id, username, name, email, password)
		VALUES (?, ?, ?, ?, ?)
	`
	_, err := r.db.ExecContext(ctx, query, user.ID, user.Username, user.Name, user.Email, user.Password)
	if err != nil {
		return nil, err
	}
	return r.FindByID(ctx, user.ID)

}

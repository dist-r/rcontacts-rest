package user

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/utils"
)

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (u *UserService) RegisterUser(ctx context.Context, user *User) error {
	existingUser, err := u.repo.GetUserByEmail(ctx, user.Email)
	if err != nil {
		return err
	}

	if existingUser != nil {
		return app.NewError(409, "user already exists")
	}

	hashedPassword, err := utils.Hashed(user.Password)
	if err != nil {
		return err
	}

	user.Password = hashedPassword

	err = u.repo.CreateUser(ctx, user)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserService) LoginUser(ctx context.Context, email string, password string) (string, error) {
	existingUser, err := u.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", err
	}

	if existingUser == nil {
		return "", app.NewError(404, "user not found")
	}

	isValid, err := utils.Compare(password, existingUser.Password)
	if err != nil {
		return "", err
	}

	if !isValid {
		return "", app.NewError(401, "invalid credentials")
	}

	token, err := utils.GenerateToken(existingUser.ID, existingUser.Email)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (u *UserService) GetUserProfile(ctx context.Context, id string) (*User, error) {
	user, err := u.repo.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, app.NewError(404, "user not found")
	}
	return user, nil
}

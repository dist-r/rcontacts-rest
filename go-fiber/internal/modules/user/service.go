package user

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/app"
	"github.com/dist-r/rcontacts-rest/go-fiber/pkg/utils"
)

type UserService struct {
	repo UserRepository
	log  app.ILogger
}

func NewUserService(repo UserRepository, log app.ILogger) *UserService {
	return &UserService{repo: repo, log: log}
}

func (u *UserService) RegisterUser(ctx context.Context, user *User) (*UserResult, error) {
	existingUser, err := u.repo.GetUserByEmail(ctx, user.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, app.NewError(409, "user already exists")
	}
	hashedPassword, err := utils.Hashed(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword
	newUser, err := u.repo.CreateUser(ctx, user)
	if err != nil {
		return nil, err
	}
	userResult := &UserResult{
		ID:       newUser.ID,
		Username: newUser.Username,
		Name:     newUser.Name,
		Email:    newUser.Email,
	}
	u.log.Debug("User Registration was succesfully", "user", DataLoggerUser{
		ID:       newUser.ID,
		Username: newUser.Username,
		Name:     newUser.Name,
		Email:    newUser.Email,
	})
	return userResult, nil
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
	u.log.Debug("User Login was succesfully", "user", DataLoggerUser{
		ID:       existingUser.ID,
		Username: existingUser.Username,
		Name:     existingUser.Name,
		Email:    existingUser.Email,
	})
	token, err := utils.GenerateToken(existingUser.ID, existingUser.Email)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (u *UserService) GetUserProfile(ctx context.Context, id string) (*UserResult, error) {
	user, err := u.repo.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, app.NewError(404, "user not found")
	}
	userResult := &UserResult{
		ID:       user.ID,
		Username: user.Username,
		Name:     user.Name,
		Email:    user.Email,
	}
	return userResult, nil
}

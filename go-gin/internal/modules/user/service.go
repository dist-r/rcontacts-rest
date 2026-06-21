package user

import (
	"context"

	"github.com/dist-r/rcontacts-rest/go-gin/pkg/app"
	"github.com/dist-r/rcontacts-rest/go-gin/pkg/utils"
	"github.com/google/uuid"
)

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (us *UserService) Register(ctx context.Context, data *RegisterDto) (*RegisterDataRes, error) {

	existingUser, err := us.repo.FindByEmail(ctx, data.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, app.NewError(409, "user already exists")
	}
	hashedPassword, err := utils.Hashed(data.Password)
	if err != nil {
		return nil, err
	}
	data.Password = hashedPassword
	newUser := &User{
		ID:       uuid.New().String(),
		Username: data.Username,
		Name:     data.Name,
		Email:    data.Email,
		Password: data.Password,
	}
	result, err := us.repo.Save(ctx, newUser)
	if err != nil {
		return nil, err
	}
	registerResult := &RegisterDataRes{
		ID:       result.ID,
		Username: result.Username,
		Name:     result.Name,
		Email:    result.Email,
	}
	return registerResult, nil
}

func (us *UserService) Login(ctx context.Context, data *LoginDto) (string, error) {
	checkUserExists, err := us.repo.FindByEmail(ctx, data.Email)
	if err != nil {
		return "", err
	}
	if checkUserExists == nil {
		return "", app.NewError(404, "user not found")
	}
	isValid, err := utils.Compare(data.Password, checkUserExists.Password)
	if err != nil {
		return "", err
	}
	if !isValid {
		return "", app.NewError(401, "invalid credentials")
	}
	token, err := utils.GenerateToken(checkUserExists.ID, checkUserExists.Email)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (us *UserService) Profile(ctx context.Context, id string) (*ProfileDataRes, error) {
	checkUserExists, err := us.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if checkUserExists == nil {
		return nil, app.NewError(404, "user not found")
	}
	return &ProfileDataRes{
		ID:       checkUserExists.ID,
		Username: checkUserExists.Username,
		Name:     checkUserExists.Name,
		Email:    checkUserExists.Email,
	}, nil
}

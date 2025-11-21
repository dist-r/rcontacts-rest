package user

import "context"

type MockUserRepository struct {
	CreateUserFunc     func(ctx context.Context, user *User) error
	GetUserByIDFunc    func(ctx context.Context, id int) (*User, error)
	GetUserByEmailFunc func(ctx context.Context, email string) (*User, error)
}

func (m *MockUserRepository) CreateUser(ctx context.Context, user *User) error {
	return m.CreateUserFunc(ctx, user)
}

func (m *MockUserRepository) GetUserByID(ctx context.Context, id int) (*User, error) {
	return m.GetUserByIDFunc(ctx, id)
}

func (m *MockUserRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	return m.GetUserByEmailFunc(ctx, email)
}

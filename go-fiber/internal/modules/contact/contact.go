package contact

type Contact struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Phone  string `json:"phone"`
}

type ContactResponse struct {
	Message string `json:"message"`
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface CreateContactResponse {
  
}
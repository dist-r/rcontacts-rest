import {z} from "zod";

export const CreateContactType = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
});

export const UpdateContactType = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
});

export const DeleteContactType = z.object({
  id: z.string().min(1, 'Id is required'),
});

export type CreateContactResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type UpdateContactResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type DeleteContactResponseDto = {
  message: string;
}

export type GetAllContactsResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type CreateContactDto = z.infer<typeof CreateContactType>;
export type UpdateContactDto = z.infer<typeof UpdateContactType>;
export type DeleteContactDto = z.infer<typeof DeleteContactType>;
import { z } from "zod";

export const CreateContactSchema = z.object(
  {
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1)
  }
)

export const UpdateContactSchema = z.object(
  {
    id: z.string().min(1),
    userId: z.string().min(1),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional()
  }
)

export type CreateContactResponse = {
  id: string
  userId: string
  name: string
  email: string
  phone: string
}

export type UpdateContactResponse = {
  id: string
  userId: string
  name: string
  email: string
  phone: string
}

export type FindAllContactResponse = {
    id: string
    userId: string
    name: string
    email: string
    phone: string
}[]


export type UpdateContactDto = z.infer<typeof UpdateContactSchema>
export type CreateContactDto = z.infer<typeof CreateContactSchema>
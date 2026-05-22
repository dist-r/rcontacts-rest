import {z} from "zod"

export const CreateUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export type LoginResponse = {
  token: string
}

export type RegisterResponse = {
  id: string,
  name: string,
  username: string,
  email: string
}

export type ProfileResponse = {
  id: string,
  name: string,
  username: string,
  email: string
}

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;
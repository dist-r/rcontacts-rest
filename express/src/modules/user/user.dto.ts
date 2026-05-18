import {z} from 'zod';

export const CreateUserType = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const LoginUserType = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type CreateUserResponseDto = {
  id: string;
  name: string;
  username: string;
  email: string;
}

export type ProfileUserResponseDto = {
  id: string;
  name: string;
  username: string;
  email: string;
}

export type LoginUserResponseDto = {
  token: string;
}

export type CreateUserDto = z.infer<typeof CreateUserType>;
export type LoginUserDto = z.infer<typeof LoginUserType>;
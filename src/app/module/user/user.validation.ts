import { z } from 'zod';

const registration = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required' }),
    userId: z.string({required_error:"userId is required"}),
    email: z.string({ required_error: 'email is required' }).email(),
    password: z.string({ required_error: 'password is required' }),
  }),
});


export const UserValidation = { registration };

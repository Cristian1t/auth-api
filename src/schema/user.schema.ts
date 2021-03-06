import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
    email: string({
      required_error: 'Email is required'
    }).email('Email is invalid'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and password confirmation must match',
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
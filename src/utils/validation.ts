import { z } from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'Name must start with capital letter'),
    age: z
      .number()
      .min(1, 'Age is required')
      .positive('Age must be positive')
      .int('Age must be integer'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.string().min(1, 'Gender is required'),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must accept the terms and conditions'
      ),
    image: z
      .instanceof(FileList)
      .optional()
      .refine(
        (val) => !val || val.length === 0 || val[0].size <= 2000000,
        'File too large'
      )
      .refine(
        (val) =>
          !val ||
          val.length === 0 ||
          ['image/jpeg', 'image/png'].includes(val[0].type),
        'Unsupported file format'
      ),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;

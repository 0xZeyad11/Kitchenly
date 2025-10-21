import {z} from 'zod';
import { Role } from '@prisma/client';

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").transform(val => val.trim()),
  email: z.email("Invalid email").transform(val => val.trim()),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters")
    .max(32, "Maximum password length should be 32 characters only!")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[\!\@\#\$\%\^\&\*]/,
      "Password must contain at least one special character"
    ),
  role: z.enum(Role).default("CUSTOMER"),
  age: z.number().min(18, "User must be at least 18 years old").optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  nationalId: z.string().transform((val) => val?.trim()).optional(),
});

export const emailOnlySchema = createUserSchema.pick({
  email: true 
});


//Refactor this shit, replace with `pick` whenever possible
export type CreateUserInput = z.infer<typeof createUserSchema>;
export const UpdateUserInput = createUserSchema.partial();
export type UserPartialType = z.infer<typeof UpdateUserInput> ; 


export type EmailOnlyInput = z.infer<typeof emailOnlySchema> ;
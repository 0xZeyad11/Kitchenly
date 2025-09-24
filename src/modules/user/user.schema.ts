import {z} from 'zod';


export const createUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(8 , "Password must be at least 6 characters"),
    role: z.enum(["ADMIN" , "CHIEF", "CUSTOMER"]).default("CUSTOMER"),
    age: z.number().min(18 , "User must be at least 18 years old").optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    nationalId: z.string().optional(),
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
export const UpdateUserInput = createUserSchema.partial();
import { FoodType, ItemType } from '@prisma/client';
import { z } from 'zod';

export const MenuItemSchema = z.object({
  name: z.string()
    .min(3, 'Item name should be at least 3 characters')
    .max(32, 'Item name should be at most 32 characters')
    .regex(/^[\p{L}\p{N} ]+$/u, "Name may only contain letters, numbers and spaces")
    .transform(val => val.trim()),
  description: z.string()
    .min(10, 'Description should be at least 10 characters')
    .max(500, 'Description should be at most 500 characters')
    .transform(val => val.trim()),
  
  price: z.coerce.number()
    .positive("Price must be positive")
    .max(10000, "Price seems unreasonably high")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
  
  foodType: z.enum(FoodType).default("ARABIAN"),
  
  itemType: z.enum(ItemType).default("MAINDISH"),
  
  chief_id: z.string()
    .min(1, "Chief ID is required")
    .regex(/^c[a-z0-9]{24}$/i, "Invalid chief ID format"),

});

export type CreateMenuItemInput  = z.infer<typeof MenuItemSchema> ;
export const UpdateMenuSchema = MenuItemSchema.partial();
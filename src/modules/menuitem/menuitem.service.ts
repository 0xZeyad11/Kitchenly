import slugify from "slugify";
import { createMenuItem } from "./menuitem.repository";
import { MenuItem, Role } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { CreateMenuItemInput } from "./menuitem.schema";

export const CreateMenuItemService = async(data: CreateMenuItemInput) : Promise<MenuItem>=>{
    const item_slug = slugify(data.name , {lower: true , trim: true}) ; 
    data.slug = item_slug ; 
    const {chef_id , ...rest} = data ; 
    const prismadata: Prisma.MenuItemCreateInput = {
        ...rest , 
        slug: item_slug,
        chef:{
            connect:{
                id: chef_id
            }
        }
    }
    return await createMenuItem(prismadata) ; 
}
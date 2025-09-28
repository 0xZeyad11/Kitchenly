import prisma from "../../config/db";
import { Prisma, MenuItem } from "@prisma/client"



export async function createMenuItem(data: Prisma.MenuItemCreateInput):Promise<MenuItem>{
    try {
       return await prisma.menuItem.create({data}); 
    } catch (error) {
        throw error;
    }
}

export async function updateMenuItem (data: Prisma.MenuItemUpdateInput , id: string): Promise<MenuItem>{
    try {
       return await prisma.menuItem.update({where: {id} , data}) ;
    } catch (error) {
        throw error ; 
    }
}
export async function deleteMenuItem (id: string){
    try {
        await prisma.menuItem.delete({where: {id}}) ;  
    } catch (error) {
       throw error ;  
    }
}

export async function getMenuItem(id: string): Promise<MenuItem | null>{
    try {
       return await prisma.menuItem.findUniqueOrThrow({where: {id}}); 
    } catch (error) {
       throw error ; 
    }
}
export async function getAllMenuItems(options: Prisma.MenuItemFindManyArgs): Promise<MenuItem[]>{
    try {
       return await prisma.menuItem.findMany({
        ...options,
       }); 
    } catch (error) {
       throw error ; 
    }
}
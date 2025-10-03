import prisma from "../../config/db";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
import { Prisma, MenuItem } from "@prisma/client";

export async function createMenuItem(
  data: Prisma.MenuItemCreateInput,
): Promise<MenuItem> {
  try {
    return await prisma.menuItem.create({ data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function updateMenuItem(
  data: Prisma.MenuItemUpdateInput,
  id: string
): Promise<MenuItem> {
  try {
    return await prisma.menuItem.update({ where: { id }, data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getMenuItem(
  id: string,
  chiefid: string
): Promise<MenuItem | null> {
  try {
    return await prisma.menuItem.findUniqueOrThrow({
      where: { id: id, chef_id: chiefid },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getAllMenuItems(
  options: Prisma.MenuItemFindManyArgs, 
  chiefid: string
): Promise<MenuItem[]> {
  try {
    return await prisma.menuItem.findMany({
      ...options,
      where:{id: chiefid}
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}


export async function getAllMenuItemsAdmin(
  options: Prisma.MenuItemFindManyArgs,
): Promise<MenuItem[]>{
  try {
    return await prisma.menuItem.findMany({
      ...options , 
    }) 
  } catch (error) {
   throw sendPrismaError(error); 
  }
}
import prisma from "../../config/db";
import { User, Prisma } from "@prisma/client";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";


export async function getUserByEmailAuth(data: string): Promise<any>{
  try{
    return await prisma.user.findUniqueOrThrow({
      where: { email: data },
      select: { "id": true,"password": true },
    });  
  }catch(error){
    sendPrismaError(error);
  }
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getAllUsers(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      ...options,
    });
  } catch (error) {throw sendPrismaError(error)}
}

export async function getAllChiefs(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: { role: "CHIEF" },
      ...options,
    });
  } catch (error) {
    throw sendPrismaError(error);

  }
}

export async function getUser(id: string): Promise<User> {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function deleteUser(id: string): Promise<User | null> {
  try {
    return await prisma.user.delete({
      where: { id: id },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> {
  try {
    return await prisma.user.update({ where: { id }, data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getAllCustomers(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      ...options,
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

import AppError from "../../common/utils/AppError";
import prisma from "../../config/db";
import { User, Prisma } from "@prisma/client";
// import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
// import { buildPrismaQuery } from "../../common/utils/queryBuilder";

// const userSelect = {
//     id: true, 
//     name: true, 
//     email: true, 
//     role: true,
//     createdAt: true,
// }
// export type UserPublic = Prisma.UserGetPayload<{select: typeof  userSelect}>;


export async function getUserByEmailAuth(data: string): Promise<any>{
  try{
    return await prisma.user.findUniqueOrThrow({
      where: { email: data },
      select: { "id": true,"password": true },
    });  
  }catch(error){
    throw new AppError("User not found" , 404);
  }
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw error  ; 
  }
}

export async function getAllUsers(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  return await prisma.user.findMany(
    {
      ...options,
    }
  );
}

export async function getAllChiefs(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany(
      {
        where: {role: "CHIEF"},
        ...options,
      }
    );
  } catch (error) {
    throw new AppError("Error fetching chiefs", 400);
  }
}

export async function getUser(id: string): Promise<User> {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw error;
    }
    throw new AppError("Database Error 💥", 500);
  }
}

export async function deleteUser(id: string): Promise<User| null> {
  try {
    return await prisma.user.delete({
      where: { id: id },
    });
  } catch (error) {
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> {
  return await prisma.user.update({ where: { id }, data});
}

export async function getAllCustomers(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: {role: 'CUSTOMER'},
      ...options ,
    });
  } catch (error) {
    // throw new AppError("Error getting all customers", 400);
    throw error;
  }
}

import prisma from "../../config/db";
import { Prisma , User } from "../../generated/prisma";


const userSelect = {
    id: true, 
    name: true, 
    email: true, 
    role: true,
    createdAt: true,
}

export type UserPublic = Prisma.UserGetPayload<{select: typeof  userSelect}>;

export async function createUser(data: Prisma.UserCreateInput) : Promise<User>{
    return await prisma.user.create({data});
}


export async function getAllUsers(): Promise<UserPublic[]>{
    return await prisma.user.findMany({
        select: userSelect
    });
}

export async function getUser(id: string): Promise<UserPublic | null> {
    return await prisma.user.findUnique(
        {
            where: {id},
            select: userSelect
        }
    )
}

export async function deleteUser(id: string):Promise<User | null>{
    return await prisma.user.delete({
        where: {id: id}
    });
}

export async function updateUser(id:string, data: Prisma.UserUpdateInput): Promise<UserPublic> {
  return await prisma.user.update({ where: { id }, data  , select: userSelect});
}
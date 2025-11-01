import prisma from "../../../prisma/db";
import { User, Prisma } from "@prisma/client";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";


// User this instead of selecting all data while doing raw queries because location is not supported
const user_data =
  ` 
  u.id , 
  u.name, 
  u.age , 
  u.role , 
u."createdAt"
`
export async function getUserByEmailAuth(data: string): Promise<any> {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { email: data },
      select: { id: true, name: true, email: true, password: true },
    });
  } catch (error) {
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
  } catch (error) { throw sendPrismaError(error) }
}

export async function getAllChiefs(
  options: Prisma.UserFindManyArgs
): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: { role: "CHEF" },
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

export async function getNearbyChefs(
  userid: string,
  distanceMeters: number
): Promise<(User & { distance_meters: number })[]> {
  try {
    const chefs = await prisma.$queryRaw<
      (User & { distance_meters: number })[]
    >
      `
SELECT 
${Prisma.raw(user_data)},
ST_Distance(u.location, ref.location) AS distance_meters
FROM "User" u
JOIN "User" ref ON ref.id = ${userid}
WHERE u.id <> ref.id
AND u.role = 'CHEF'
AND ST_Distance(u.location, ref.location) <= ${distanceMeters}
ORDER BY distance_meters ASC;
`;
    return chefs;
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function setUserLocation(userid: string, lat: number, lng: number): Promise<void> {
  try {
    await prisma.$executeRaw
      `
UPDATE  "User" 
SET "location" = ST_SetSRID(ST_MakePoint(${lng},${lat}) , 4326)::geography
WHERE id = ${userid} ;
` ;
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getNearestChef(userid: string, distance: number, NumberOfChefs?: number): Promise<User[]> {
  try {
    const no_of_chefs = NumberOfChefs === 0 ? 0 : NumberOfChefs;
    return await prisma.$queryRaw<User[]>`
SELECT 
${Prisma.raw(user_data)},
ST_Distance(u.location, ref.location) AS distance_meters
FROM "User" u
JOIN "User" ref ON ref.id = ${userid}
WHERE u.id <> ref.id
AND u.role = 'CHEF'
AND ST_DWithin(u.location, ref.location , ${distance}) 
ORDER BY distance_meters ASC
LIMIT ${no_of_chefs ?? 10};
`

  } catch (error) {
    throw sendPrismaError(error);
  }
}


import { Prisma, Order } from "@prisma/client";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
import prisma from "../../../prisma/db";

export async function CreateNewOrder(
  data: Prisma.OrderCreateInput,
): Promise<Order> {
  try {
    return await prisma.order.create({ data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function DeleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function GetOrderById(id: string): Promise<Order | null> {
  try {
    return await prisma.order.findFirstOrThrow({ where: { id } });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

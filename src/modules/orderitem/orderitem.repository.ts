import { Prisma, OrderItem } from "@prisma/client";
import prisma from "../../../prisma/db";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";

export async function createOrderItem(
  data: Prisma.OrderItemCreateInput,
): Promise<OrderItem> {
  try {
    return await prisma.orderItem.create({ data });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function createOrderItems(
  data: Prisma.OrderItemCreateManyInput[],
): Promise<{ count: number }> {
  return await prisma.orderItem.createMany({ data });
}

export async function updateOrderItem(
  data: Prisma.OrderItemUpdateInput,
  id: string,
): Promise<OrderItem> {
  try {
    const { quantity } = data;

    return await prisma.orderItem.update({
      where: { id },
      data: { quantity: quantity },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function deleteOrderItem(id: string) {
  try {
    await prisma.orderItem.delete({ where: { id } });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

export async function getOrderItem(id: string) {
  try {
    return await prisma.orderItem.findUniqueOrThrow({ where: { id } });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

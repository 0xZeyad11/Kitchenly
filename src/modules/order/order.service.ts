import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
import AppError from "../../common/utils/AppError";
import { createNewOrder, FullOrder, orderItemInput } from "./order.repository";
import prisma from "../../../prisma/db";
import { OrderStatus } from "@prisma/client";

export const CreateOrderService = async (
  userid: string,
  chefid: string,
  items: orderItemInput[],
  image?: string,
) => {
  try {
    if (userid === chefid) {
      throw new AppError("You can't order from your self", 400);
    }
    await prisma.user.findUniqueOrThrow({
      where: { id: chefid },
    });
    await prisma.user.findUniqueOrThrow({
      where: { id: userid },
    });
    return await createNewOrder(userid, chefid, items, image);
  } catch (error) {
    throw sendPrismaError(error);
  }
};

export const UpdateOrderStatusService = async (
  orderid: string,
  status: OrderStatus,
) => {
  try {
    return await prisma.order.update({
      where: { id: orderid },
      data: { order_status: status },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
};

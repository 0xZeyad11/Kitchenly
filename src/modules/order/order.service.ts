import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
import AppError from "../../common/utils/AppError";
import { createNewOrder, FullOrder, orderItemInput } from "./order.repository";
import prisma from "../../../prisma/db";

export const CreateOrderService = async (
  userid: string,
  chefid: string,
  items: orderItemInput[],
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
    return await createNewOrder(userid, chefid, items);
  } catch (error) {
    throw sendPrismaError(error);
  }
};

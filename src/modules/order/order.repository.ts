import { Order } from "@prisma/client";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";
import prisma from "../../../prisma/db";
import AppError from "../../common/utils/AppError";

type orderItemInput = {
  menuitem_id: string;
  quantity: number;
  item_price: number;
};

export async function createNewOrder(
  userid: string,
  chefid: string,
  items: orderItemInput[],
): Promise<Order> {
  try {
    if (!items || items.length === 0) {
      throw new AppError(
        "You must have at least one item in order to create an order",
        400,
      );
    }

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customer_id: userid,
          chef_id: chefid,
          total_price: items.reduce(
            (sum, i) => sum + i.item_price * i.quantity,
            0,
          ),
          order_status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          quantity: item.quantity,
          item_price: item.item_price,
          menuitem_id: item.menuitem_id,
          order_id: order.id,
        })),
      });
      const fullorder = await tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: {
          orderitems: {
            include: {
              menuitem: true,
            },
          },
        },
      });
      return fullorder;
    });
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
    return await prisma.order.findFirstOrThrow({
      where: { id },
      include: {
        orderitems: {
          include: { menuitem: true },
        },
        customer: true,
        chef: true,
      },
    });
  } catch (error) {
    throw sendPrismaError(error);
  }
}

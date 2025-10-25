import { Response, Request, NextFunction } from "express";
import { catchAsync } from "../../common/utils/catchAsync";
import AppError from "../../common/utils/AppError";
import {
  createOrderItem,
  deleteOrderItem,
  getOrderItem,
} from "./orderitem.repository";
import { apiResponse } from "../../common/utils/ApiResponse";

const MAXIMUM_QUANTITY = 20;
export const CreateOrderItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { menuitem_id, quantity, price, order_id } = req.body;
    const orderitem = await createOrderItem({
      menuitem: {
        connect: { id: menuitem_id },
      },
      order: {
        connect: { id: order_id },
      },
      quantity: quantity,
      item_price: price,
    });
    apiResponse(res, "success", 200, orderitem);
  },
);

// I don't know man, I think this function shouldn't have existed ?

// export const UpdateOrderItem = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     let { quantity } = req.body;
//     if (quantity > MAXIMUM_QUANTITY) {
//       quantity = MAXIMUM_QUANTITY;
//     } else if (quantity <= 0) {
//       return next(
//         new AppError(
//           "Invalid quantity number for this item, please delete it from your order if you don't want it!!!",
//           400,
//         ),
//       );
//     }
//     const newItem = updateOrderItem({ quantity }, id);
//     apiResponse(res , "success", 200 , newItem);
//   },
// );

export const DeleteOrderItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await deleteOrderItem(id);
    apiResponse(res, "success", 204);
  },
);

export const GetOrderItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const orderitem = await getOrderItem(id);
    if (!orderitem) {
      return apiResponse(res, "failed", 400);
    }
    apiResponse(res, "success", 200, orderitem);
  },
);

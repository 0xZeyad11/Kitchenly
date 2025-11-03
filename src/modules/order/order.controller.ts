import { Response, Request, NextFunction } from "express";
import { catchAsync } from "../../common/utils/catchAsync";
import {
  deleteOrder,
  getAllOrders,
  getAllOrdersChef,
} from "./order.repository";
import AppError from "../../common/utils/AppError";
import { CreateOrderService } from "./order.service";
import { apiResponse } from "../../common/utils/ApiResponse";

export const CreateNewOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userid, chefid, items } = req.body;
    if (!userid || !chefid) {
      return next(
        new AppError(`Please makesure to provide the user and chef ids`, 404),
      );
    }
    if (!items || items.length === 0) {
      return next(
        new AppError(
          "There must be at least 1 order item in order to complete this order",
          400,
        ),
      );
    }
    
    // Handle optional image upload
    let imageUrl = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const fullorder = await CreateOrderService(userid, chefid, items, imageUrl);
    apiResponse(res, "success", 200, fullorder);
  },
);

export const DeleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      return apiResponse(
        res,
        "failed",
        404,
        undefined,
        "There is no id provided for deleting the order",
      );
    }
    const deletedOrder = await deleteOrder(id);
    apiResponse(res, "success", 204);
  },
);

export const GetAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(
          "There is error fetching your id, please login again!",
          403,
        ),
      );
    }
    const userid = req.user.id;
    const my_orders = await getAllOrders(userid);
    apiResponse(res, "success", 200, my_orders, undefined, my_orders.length);
  },
);

export const GetAllOrdersChef = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(
          "There is error fetching your id, please login again!",
          403,
        ),
      );
    }
    const userid = req.user.id;
    const my_orders = await getAllOrdersChef(userid);
    apiResponse(res, "success", 200, my_orders, undefined, my_orders.length);
  },
);

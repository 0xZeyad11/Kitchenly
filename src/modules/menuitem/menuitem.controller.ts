import {
  getAllMenuItems,
  deleteMenuItem,
  updateMenuItem,
  getMenuItem,
  getAllMenuItemsAdmin,
  getMenuItemBySlug,
} from "./menuitem.repository";
import { buildPrismaQuery } from "../../common/utils/queryBuilder";
import { catchAsync } from "../../common/utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { MenuItemSchema, UpdateMenuSchema } from "./menuitem.schema";
import AppError from "../../common/utils/AppError";
import { CreateMenuItemService } from "./menuitem.service";
import { Role } from "@prisma/client";
import { apiResponse } from "../../common/utils/ApiResponse";
import { sendZodError } from "../../common/middelware/errorhandler.middleware";

export const CreateNewItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let chefid = "";
    if (!req.user) {
      return next(
        new AppError("There is no logged in user to complete this action", 401),
      );
    }
    if (req.user.role === Role.CHEF) {
      chefid = req.user.id;
    } else if (req.user.role === Role.ADMIN) {
      chefid = req.body.chefid;
    } else {
      return next(
        new AppError(`You aren't authorized to perform this action`, 401),
      );
    }
    if (!chefid) {
      return next(
        new AppError(`There is no chef id associated with this item`, 404),
      );
    }
    const rawdata = { chef_id: chefid, ...req.body };
    const parsed = MenuItemSchema.safeParse(rawdata);
    if (!parsed.success) {
      return next(new AppError(`${parsed.error.message}`, 400));
    }
    const data = parsed.data;
    const item = await CreateMenuItemService(data);
    apiResponse(res, "success", 200, item);
  },
);

export const DeleteMenuItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let chefid;
    if (!req.user) {
      return next(
        new AppError(`There is no chef associated with this item`, 404),
      );
    } else if (req.user.role === Role.CHEF) {
      chefid = req.user.id;
      console.log("Current user: ", req.user.id);
    } else if (req.user.role === Role.ADMIN) {
      chefid = req.body.chefid;
      if (!chefid) {
        return next(
          new AppError(
            `since you are an admin provide chef id in the request body as <chefid>`,
            400,
          ),
        );
      }
    }
    const finditem = await getMenuItem(id, chefid);
    if (!finditem) {
      return next(new AppError("Could not find this item for deleting!!", 404));
    }
    await deleteMenuItem(finditem.id);
    apiResponse(res, "success", 204);
  },
);

export const GetMenuItemByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;
    if (!user || user.role !== "CHEF") {
      return next(new AppError("This chief doesn't exists!", 404));
    }
    const finditem = await getMenuItem(id, user.id);
    if (!finditem) {
      return next(new AppError("Could not find this item for deleting!!", 404));
    }
    apiResponse(res, "success", 200, finditem);
  },
);

export const GetAllMenuItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = buildPrismaQuery(req.query);
    let chefid = "";
    if (!req.user) {
      return next(new AppError(`There is no authenticated user`, 401));
    }
    if (req.user?.role === Role.CHEF) {
      chefid = req.user.id;
    } else if (req.user.role === Role.ADMIN) {
      chefid = req.params.chefid;
    }
    const allMenuItems = await getAllMenuItems(options, chefid);
    apiResponse(
      res,
      "success",
      200,
      allMenuItems,
      undefined,
      allMenuItems.length,
    );
  },
);

export const UpdateMenuItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let filtereddata;
    let chiefid;
    // if (req.body.chief_id) {
    //   const { chief_id, ...rest } = req.body;
    //   filtereddata = rest;
    //   chiefid = chief_id;
    // }
    const validData = UpdateMenuSchema.safeParse(req.body);
    if (!validData.success) {
      return next(sendZodError(validData.error));
    }
    if (!req.user) {
      return next(
        new AppError("Please login inorder to complete this action!", 403),
      );
    } else if (req.user.role !== Role.CHEF) {
      return next(
        new AppError("You arenot authorized to do this action !!", 403),
      );
    }
    const finditem = await getMenuItem(id, req.user.id);
    if (!finditem) {
      return next(new AppError("Can not find this item!!", 404));
    }
    const updateItem = await updateMenuItem(validData.data, id);
    apiResponse(res, "success", 200, updateItem);
  },
);

export const GetAllMenuItemsAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const data = await getAllMenuItemsAdmin(options);
    apiResponse(res, "success", 200, data, undefined, data.length);
  },
);

// TODO : Fix this Implementation
export const GetAllMenuItemsBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item_name = req.params.item_name;
    if (!item_name) {
      return next(new AppError(`Please provide the item's name`, 400));
    }
    const item = await getMenuItemBySlug(item_name);
    if (!item) {
      return next(new AppError(`Couldn't find this item`, 404));
    }

    apiResponse(res, "success", 200, item);
  },
);

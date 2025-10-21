import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getAllChiefs,
  getAllCustomers,
} from "./user.repository";
import { Request, Response, NextFunction } from "express";
import { UpdateUserInput } from "./user.schema";
import { catchAsync } from "../../common/utils/catchAsync";
import AppError from "../../common/utils/AppError";
import { buildPrismaQuery } from "../../common/utils/queryBuilder";
import bcrypt from "bcrypt";
import { FilterObject } from "../../utils/filterObject";
import { apiResponse } from "../../utils/ApiResponse";
import { success } from "zod";

export const GetAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const buildQuery = buildPrismaQuery(req.query);
    const found_users = await getAllUsers(buildQuery);
    apiResponse(
      res,
      "success",
      200,
      found_users,
      undefined,
      found_users.length,
    );
  },
);

export const GetUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const findUser = await getUser(id);
    if (!findUser) {
      return next(new AppError("There is no user found", 404));
    }
    apiResponse(res, "success", 200, findUser);
  },
);

export const DeleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deleteuser = await deleteUser(id);
    if (!deleteuser) {
      return next(new AppError("No user found!", 404));
    }
    apiResponse(res, "success", 204, undefined, "user deletd");
  },
);

export const UpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const UnAllowedList: string[] = [
      "password",
      "role",
      "updatedAt",
      "createdAt",
      "passwordUpdatedAt",
    ];
    const data = { ...req.body };
    const filteredData = FilterObject(UnAllowedList, data);
    const validatedData = UpdateUserInput.safeParse(filteredData);
    if (!validatedData.success) {
      return next(new AppError("Invalid data entered", 400));
    }
    const updatedUser = await updateUser(id, validatedData.data);
    if (!updatedUser) {
      return next(new AppError("This user is not found", 404));
    }
    apiResponse(res, "success", 200, {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  },
);

export const GetAllChiefs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const chefs = await getAllChiefs(options);
    apiResponse(res, "success", 200, chefs, undefined, chefs.length);
  },
);

export const GetAllCustomers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const customers = await getAllCustomers(options);
    res.status(200).json({
      status: "success",
      length: customers.length,
      data: customers,
    });
  },
);

export const Logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      message: "Loged out successfully",
    });
  },
);

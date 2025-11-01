import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getAllChiefs,
  getAllCustomers,
  getNearbyChefs,
  setUserLocation,
  getNearestChef
} from "./user.repository";
import { Request, Response, NextFunction } from "express";
import { UpdateUserInput } from "./user.schema";
import { catchAsync } from "../../common/utils/catchAsync";
import AppError from "../../common/utils/AppError";
import { buildPrismaQuery } from "../../common/utils/queryBuilder";
import { FilterObject } from "../../common/utils/filterObject";
import { apiResponse } from "../../common/utils/ApiResponse";

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
    apiResponse(res, "success", 200, customers, undefined, customers.length);
  },
);

export const Logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      message: "Loged out successfully",
    });
    apiResponse(res, "success", 200, undefined, undefined, undefined);
  },
);

export const SetUserLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    const user = await getUser(userid);
    if (!user) {
      return apiResponse(res, "failed", 404, undefined, "can't find this user");
    }
    const { lat, lng } = req.body;
    await setUserLocation(userid, lat, lng);
    apiResponse(res, "success", 200, undefined, "user location updated successfully");
  }
);

export const GetNearestChefs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    const { distance, NumberOfChefs } = req.body;
    const nearestChefs = await getNearestChef(userid, distance, NumberOfChefs);
    apiResponse(res, "success", 200, nearestChefs, undefined, nearestChefs.length);
  }
)

// TODO: Implement this function
export const GetNearbyChefs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    const { distance } = req.body;
    const near_chefs = await getNearbyChefs(userid, distance);
    if (!near_chefs || near_chefs.length === 0) {
      return apiResponse(res, "failed", 404, undefined, "There is no chefs near to your location");
    }
    apiResponse(res, "success", 200, near_chefs, undefined, near_chefs.length);
  }
)

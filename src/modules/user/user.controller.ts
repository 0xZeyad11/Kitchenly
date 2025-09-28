import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getAllChiefs,
  getAllCustomers
} from "./user.repository";
import { Request, Response, NextFunction } from "express";
import { UpdateUserInput } from "./user.schema";
import { catchAsync } from "../../common/utils/catchAsync";
import AppError from "../../common/utils/AppError";
import { buildPrismaQuery } from "../../common/utils/queryBuilder";
import bcrypt from 'bcrypt';

// TODO ADD API FEATURES FOR GETALL,GETCUSTOMERS,GETCHIEFS
// TODO PAGINATION,SORTING,LIMITING,FIELDS

export const GetAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const buildQuery = buildPrismaQuery(req.query);
    const found_users = await getAllUsers(buildQuery);
    res.status(200).json({
      status: "Success",
      data: {
        found_users,
      },
    });
  }
);

export const GetUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const findUser = await getUser(id);
    if (!findUser) {
      return next(new AppError("There is no user found", 404));
    }
    res.status(200).json({
      statuts: "Success",
      data: findUser,
    });
  }
);

export const DeleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deleteuser = await deleteUser(id);
    if (!deleteuser) {
      return next(new AppError("No user found!", 404));
    }
    res.status(204).json({
      status: "success",
      message: "user deleted successfully !!!",
    });
  }
);

export const UpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const validatedData = UpdateUserInput.safeParse(req.body);
    if (!validatedData.success) {
      return next(new AppError("Invalid data entered", 400));
    }
    if(validatedData.data.password){
      validatedData.data.password = await  bcrypt.hash(validatedData.data.password, Number(process.env.SALT) );
    }

    // make sure users don't update thier role 
   const olduser = await getUser(id);
   if(validatedData.data.role){
    validatedData.data.role = olduser.role ;
   }

   const updatedUser = await updateUser(id, validatedData.data);
    if (!updatedUser) {
      return res.status(404).json({
        status: "failed",
        message: "can not find this user to update them",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }
);


// Should be protected if role is admin

export const GetAllChiefs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const chiefs = await getAllChiefs(options);
    let currentLoggedinuser = req?.user;
    res.status(200).json({
      status: "success",
      length: chiefs.length,
      data: chiefs,
      LoggedInUser: currentLoggedinuser ,
    });
  }
);


export const GetAllCustomers = catchAsync(
  async (req:Request , res:Response, next:NextFunction) => {
    const options = buildPrismaQuery(req.query);
    const customers = await  getAllCustomers(options);
    res.status(200).json({
      status: 'success',
      length: customers.length,
      data: customers
    })
  }
)

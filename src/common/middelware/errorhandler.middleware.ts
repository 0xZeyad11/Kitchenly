import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { Prisma } from "@prisma/client";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendError(err as AppError,req,res,next);
};

export const sendPrismaError= (error: any): AppError => {
  if(error instanceof Prisma.PrismaClientKnownRequestError){
    switch(error.code){
      case "P2002":
        return new AppError("Resource already exists" , 409);
      case "P2025":
        return new AppError("Resource not found", 404);
      case "P2003":
        return new AppError("Invalid Reference" , 400);
      default: 
        return new AppError("Database Error" , 500); 
    }
  }
  return new AppError("unexpected DB error" , 400);
}

const sendErrorDev  = (err: AppError , res:Response) => {
      res.status(err.statusCode).json({
        status: err.status , 
        message: err.message , 
        stack: err.stack
      }) 
};
const sendErrorProd= (err: AppError , res:Response) => {
      res.status(err.statusCode).json({
        status: err.status , 
        message: err.message , 
      }) 
};


const sendError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is prisma error and modify: 
    //message
    //status code
    let error ;
    if(err instanceof Prisma.PrismaClientKnownRequestError){
      error = sendPrismaError(err);
    }
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // just send the error message and don't send the error stack
    sendErrorProd(err, res);
  }
};

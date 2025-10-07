import { Role } from "@prisma/client"
import {Request , Response , NextFunction} from 'express';
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";

const restrictTo = (...roles: Role[])=> {
 return (req: Request, res: Response, next: NextFunction) => {
    const current_user = req.user;
    if (!current_user) {
      return next(
        new AppError("No User found login in, something went wrong ", 403)
      );
    }

    if (!roles.includes(current_user.role)) {
      return next(
        new AppError("You are not authorized to perform this action!", 403)
      );
    }

    next();
  };
};

export default restrictTo; 
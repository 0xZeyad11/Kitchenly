import {Request , Response,  NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { getUser } from "../../modules/user/user.repository";



// export const GetChiefsMenuItem = catchAsync(
//     async(req: Request , res:Response , next: NextFunction) => {
//         if(!req.user){
//             return next(new AppError("You are not logged in , please log in",401));
//         }
//         const user = req.user ; 
//         if(user.role !== 'CHIEF'){
//             return next(new AppError('You are not a chief to perform this action',401));
//         }
//         next(); 
//     }
// );



// export const CheckChefExists= catchAsync(
//     async (req:Request , res: Response ,next: NextFunction) => {
//         const chefid = req.params.chefid ; 
//         if(!chefid){
//             return next(new AppError("Not enough data to get the chef" , 404)) ;
//         }
//         const chef = await getUser(chefid);
//         if(!chef || chef.role !== 'CHEF'){
//             return next(new AppError(`This user is not authorized to have a menu  item` , 401));
//         }
//         next();
//     }
// )
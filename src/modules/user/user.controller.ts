import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "./user.repository";
import {Request, Response, NextFunction} from 'express';
import {  createUserSchema, UpdateUserInput } from "./user.schema";
import { ZodError } from "zod";

// TODO : Replace try catch with catchasync function 
// TODO : Write Error handler


const errorhandler = (error: Error | ZodError , req: Request , res:Response) => {
    console.error(error);
   res.status(500).json({
    status: "Something went wrong",
    message: (error.message) , 
    stack: (error.stack ),
   }) ;
}

export const CreateNewUser = async (req: Request , res: Response , next: NextFunction) => {
    try {
        const validatedData = createUserSchema.safeParse(req.body);
        if(!validatedData.success){
         return   errorhandler(validatedData.error , req ,res);
        }
        const user = await  createUser(validatedData.data);
       res.status(200).json({
        status: 'Success',
        message: 'New user created',
        data: user 
       }) 
    } catch (error) {
        errorhandler(error as Error , req ,res);
    }
}

export const GetAllUsers = async (req:Request , res:Response, next:NextFunction) => {
   try {
    const found_users = await getAllUsers();
    res.status(200).json({
        status: "Success",
        data: {
            found_users
        } 
    });
    
   } catch (error) {
    errorhandler(error as Error, req, res);
   } 
}


export const GetUser = async (req: Request , res: Response,next: NextFunction) => { 
    try{
         const id = req.params.id ; 
         const findUser = await getUser(id) ; 
         if(!findUser){
            return res.status(404).json({
                status: "failed",
                message: "Can not find the user"
            });
         }
         res.status(200).json({
            statuts: 'Success' , 
            data: findUser , 
         }) 
    }catch(error){
        errorhandler(error as Error ,req ,res) ;
    }
}

export const DeleteUser = async (req:Request , res:Response , next: NextFunction) => {
    try{
      const id = req.params.id;
      const deleteuser = await deleteUser(id);
      if(!deleteuser){
        return res.status(404).json({
            status: 'failed',
            message: 'user is not found, so can not be deleted!'
        });
      }
      res.status(204).json({
        status: 'success',
        message: 'user deleted successfully !!!'
      })
    }catch(error){
        errorhandler(error as Error , req, res);
    }
}

export const UpdateUser = async (req: Request , res: Response, next: NextFunction) => {
    const id = req.params.id ;
    const validatedData = UpdateUserInput.safeParse(req.body);
    if(!validatedData.success){
        return errorhandler(validatedData.error, req , res);
    }
    const updatedUser = await updateUser(id , validatedData.data);
    if(!updatedUser){
        return res.status(404).json({
            status:"failed",
            message: 'can not find this user to update them'
        })
    }
    res.status(200).json({
        status: 'success',
        data: updateUser
    });
}
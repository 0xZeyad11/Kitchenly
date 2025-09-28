import express, {Response, Request, NextFunction} from 'express' ; 
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname , "config/config.env")})

import userRoute from './modules/user/user.route';
import { globalErrorHandler } from './common/middelware/errorhandler.middleware';


const app = express() ; 
app.use(globalErrorHandler);


app.use(express.json()) ; 
app.use('/api/v1/users' , userRoute);


app.get('/' , (req:Request , res: Response, next:NextFunction) => { 
    res.status(200).json({
        status: "Success" , 
        message: "Welcome to the root server endpoint"
    })
})


export default app ; 
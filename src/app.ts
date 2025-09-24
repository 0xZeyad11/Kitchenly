import express, {Response, Request, NextFunction} from 'express' ; 
import userRoute from './modules/user/user.route';

const app = express() ; 


app.use(express.json()) ; 
app.use('/api/v1/users' , userRoute);


app.get('/' , (req:Request , res: Response, next:NextFunction) => { 
    res.status(200).json({
        status: "Success" , 
        message: "Welcome to the root server endpoint"
    })
})


export default app ; 
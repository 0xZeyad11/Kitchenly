import {Response, Request , NextFunction} from 'express' ;
import app from './app';
import dotenv from 'dotenv';
dotenv.config({path: ['./src/config/config.env' , '.env'] , debug:true})
const PORT = process.env.PORT ||  3000 ; 

const server = app.listen(PORT, ()=>{
    console.log("⚙️  🎯 server connected successfully!") ;
})



import {Response, Request , NextFunction} from 'express' ;
import app from './app';
import dotenv from 'dotenv' ; 
dotenv.config({path:'.env'});

const port = 3000; 

const server = app.listen(port, ()=>{
    console.log("⚙️  🎯 server connected successfully!") ;
})


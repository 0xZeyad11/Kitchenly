import { Response, Request, NextFunction } from "express";
import { promisify } from "util";
import jwt, { SigningKeyCallback } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import {
  CreateUserService,
  VerifyPassword,
} from "../../modules/user/user.service";
import AppError from "../utils/AppError";
import { createUserSchema } from "../../modules/user/user.schema";
import {
  getUser,
  getUserByEmailAuth,
} from "../../modules/user/user.repository";

export const generateToken = (id: string): string => {
  const Secret = process.env.JWT_SECRET as string;
  const Expiry = process.env.JWT_EXPIRY as string;
  if (!Secret)
    throw new AppError("No secret for the jwt token specified!", 400);
  if (!Expiry)
    throw new AppError("No Expiry date for the jwt token specified!", 400);

  const token = jwt.sign({ id: id }, Secret, {
    expiresIn: Expiry,
  } as jwt.SignOptions);
  return token;
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createUserSchema.safeParse(req.body);
    if (!validatedData.success || validatedData.error) {
      return next(new AppError("Error validating the user data", 400));
    }
    const user = await CreateUserService(validatedData.data);
    const token = generateToken(user.id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user.id,
        },
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    const user = await getUserByEmailAuth(email);
    if (!user || !(await VerifyPassword(password, user.password))) {
      return next(new AppError(`Wrong Email or Password`, 404));
    }
    const token = generateToken(user.id);
    console.log("\n Login token has been issued\n");
    res.status(200).json({
      status: "Success",
      token,
      data: {
        id: user.id,
      },
    });
  }
);

export const protectRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if there is a token in the headers
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(new AppError("You are not logged in ,Please login in!", 401));
    }

    // Verify the token
    let payload: any = {};
    const verify_token = promisify(jwt.verify) as (token: string , secret: jwt.Secret) => Promise<any>; 
    try {
      const verified_token_data = await verify_token(token , process.env.JWT_SECRET as jwt.Secret)
      payload = verified_token_data;
    } catch (error) {
      return next(
        new AppError(
          "Gotcha mother fucker, Go Login or make an account!!!",
          401
        )
      );
    }

    // check if the user with that token still exists
    const userid = payload.id;
    if (!userid) {
      return next(new AppError(`Please login again`, 401));
    }
    const finduser = await getUser(userid);
    if (!finduser) {
      return next(new AppError("please login again", 401));
    }

    let passwordupdatedat = finduser.passwordUpdatedAt;
    if (passwordupdatedat) {
      passwordupdatedat = new Date(passwordupdatedat);
      const pass_time = Math.floor(passwordupdatedat.getTime() / 1000);
      const token_time = payload.iat ; 
      if (pass_time > token_time) {
        console.log(
          "\n\nPassword changed at: ",
          pass_time,
          "  \n\n\n user issued token at : ",
          token_time
        );
        return next(
          new AppError(`Password has recently changed, please login again`, 401)
        );
      }
    }

    req.user = finduser;
    next();
  }
);

// TODO add every type of users that should be restirected in an array and filter based on it ,  in the future !!!
// TODO this function is for chiefs to make crud operations on their menus
export const restirectCustomers = catchAsync(
  async (req:Request , res: Response , next: NextFunction) => { 
    if(!req.user){
      return next(new AppError('No User Found Sent that request',401)) ;
    }
    const current_user_role = req.user.role ; 
    if(current_user_role === "CUSTOMER"){
        return next(new AppError('You are not authorized to perform this action' , 401)) ;
    }
    next();
  }
)


// TODO ADD chief should be making crud on his menu only not any other menus

export const adminsOnly = catchAsync(
  async(req:Request ,res:Response, next:NextFunction) => {
    const user= req.user ; 
    if(!user){
      return next(new AppError('There is no logged in user to complete this action',401));
    }
    if(user.role !== "ADMIN"){
      return next(new AppError('You are not an admin to perform this action !!' , 401)) ;
    }
    next();
  }
)


import { Response, Request, NextFunction } from "express";
import { promisify } from "util";
import jwt, { SigningKeyCallback } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { catchAsync } from "../utils/catchAsync";
import {
  AddPasswordResetToken,
  CreateUserService,
  VerifyPassword,
} from "../../modules/user/user.service";
import AppError from "../utils/AppError";
import { createUserSchema , emailOnlySchema, UpdateUserInput , UserPartialType } from "../../modules/user/user.schema";
import {
  getUser,
  getUserByEmailAuth,
  updateUser,
} from "../../modules/user/user.repository";
import sendEmail from "../../utils/sendEmail";
import prisma from "../../../prisma/db";
import crypto from 'crypto'


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
      return next(new AppError(validatedData.error.message, 400));
    }
    const user = await CreateUserService(validatedData.data);
    const token = generateToken(user.id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user.id,
          name: user.name
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
        name: user.name
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

// STEPS OF USER RESETTING PASSWORD FLOW  
/**
 * user makes a post request on the forgot password link on the frontend
 * enters his email to check if the user already exists in the database or not 
 * user recieves an email containing the reset-token 
 * user adds the resets token in the input field
 * We check if the added reset token is the same as the one the existed user has in his records
 * if valid: 
 *  2 input fields for entering the password and confirming it
 * if not : 
 *  user doesn't have an account and redirected to the signup page in the frontend (Handeled by the front end)
 */


//INCOMPLETE implement the rest of this function
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = { ...req.body };
    const validdata = emailOnlySchema.safeParse({email});
    if (!validdata.success) {
      return next(new AppError(`${validdata.error.message}`, 400));
    }
    const finduser = await getUserByEmailAuth(validdata.data.email);
    if (!finduser) {
      return next(new AppError("Invalid email, please try again!", 404));
    }

    const reset_token = await AddPasswordResetToken(finduser.id);
    const reset_url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${reset_token}`;
    const message = `Forgot your password?, Please make a PATCH request with your new password and confirm your password on the url: ${reset_url}\nIf you didn't forget 
    your password, Please Ignore this email!`;

    try {
      await sendEmail({
        to: finduser.email,
        subject: `Your password reset email, (Valid for 10 minutes only!!!)`,
        text: message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (error) {
      await prisma.user.update({
        where: { id: finduser.id },
        data: {
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
        },
      });
      const err  = error as Error; 
      return next(
        new AppError(
          `Something went wrong when sending the token to the user email || ${err.message}`,
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url_token = req.params.token;
    const hashed_token = crypto
      .createHash("sha256")
      .update(url_token)
      .digest("hex");
    const user = await prisma.user.findFirstOrThrow({
      where: {
        passwordResetToken: hashed_token,
        passwordResetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      return next(
        new AppError(`Can't find this user, maybe the token has expired`, 404)
      );
    }
    let { password } = req.body;
    const validpassword = UpdateUserInput.safeParse({ password });
    if (!validpassword.success) {
      return next(new AppError(`${validpassword.error.message}`, 400));
    }
    const newpassword = await bcrypt.hash(
      validpassword.data.password as string,
      Number(process.env.SALT) || 10
    );

    const user_with_new_password = await updateUser(user.id, {
      password: newpassword,
      passwordUpdatedAt: new Date(Date.now()),
      passwordResetToken: null, 
      passwordResetTokenExpiry: null 
    });

    const token = generateToken(user_with_new_password.id) ; 
    req.user = user_with_new_password ; 
    res.status(200).json({
      status: "success",
      message: "user password updated",
      token ,
      data: user_with_new_password,
    });
  }
);

import bcrypt from 'bcrypt'
import { createUser  , getUser} from './user.repository'
import { CreateUserInput} from './user.schema'
import AppError from '../../common/utils/AppError'
import {GeneratePasswordResetToken }from '../../utils/generateToken'

import { UserUpdateArgs } from '../../../prisma/extensions/types'
import prisma from '../../../prisma/db'
import { Prisma } from '@prisma/client'


const salt = Number(process.env.SALT) || 10;

export const CreateUserService = async (data: CreateUserInput) => {
    const newpassword = await bcrypt.hash(data.password, salt);
    const userToCreate = {...data , password: newpassword};
    return await createUser(userToCreate) ; 
}

export const VerifyPassword = async (password: string , encrypted: string ): Promise<boolean> => {
    return await bcrypt.compare(password, encrypted);
};

/**
 * 
 * @param id user id to add the reset token
 */
export const AddPasswordResetToken = async(id: string) : Promise<string>=>{
    const user = await prisma.user.findUniqueOrThrow({where:{id}});
    if(!user){
        throw new AppError(`could not find this user to generate the password reset token`,404);
    }
    const [reset_token , encrypted]= GeneratePasswordResetToken();
    const expiry = new Date(Date.now() + 10*60*1000); 
    await prisma.user.update(
        {
            where:{id},
            data:{
                passwordResetToken: encrypted,
                passwordResetTokenExpiry:  expiry,
            }
        }
    )
    return reset_token;
}


//TODO ADD function to handle sending the token to the user email
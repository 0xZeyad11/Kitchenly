import bcrypt from 'bcrypt'
import { createUser  , getUserByEmailAuth} from './user.repository'
import { CreateUserInput} from './user.schema'
import AppError from '../../common/utils/AppError'


const salt = Number(process.env.SALT) || 10;

export const CreateUserService = async (data: CreateUserInput) => {
    const newpassword = await bcrypt.hash(data.password, salt);
    const userToCreate = {...data , password: newpassword};
    return await createUser(userToCreate) ; 
}

export const VerifyPassword = async (password: string , encrypted: string ): Promise<boolean> => {
    return await bcrypt.compare(password, encrypted);
};
import {Router} from 'express' ; 
import { CreateNewUser , DeleteUser, GetAllUsers, GetUser, UpdateUser  } from './user.controller';


const router = Router();

router.route('/').get(GetAllUsers).post(CreateNewUser);
router.route('/:id').get(GetUser).delete(DeleteUser).patch(UpdateUser);

export default router ; 
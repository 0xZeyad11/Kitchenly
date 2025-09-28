import {Router} from 'express' ; 
import {  DeleteUser, GetAllChiefs, GetAllCustomers, GetAllUsers, GetUser, UpdateUser  } from './user.controller';
import { login  , signup , protectRoute, restirectCustomers, adminsOnly} from '../../common/middelware/auth.middleware';


const router = Router();

router.route('/').get(protectRoute , adminsOnly ,GetAllUsers);
router.route('/signup').post(signup);
router.route('/login').post(login);

//TODO Protect these 2 routes for admin only!
router.route('/chiefs').get(protectRoute, adminsOnly ,GetAllChiefs);
router.route('/customers').get(protectRoute , adminsOnly , GetAllCustomers);

router.route('/:id').get(GetUser).delete(DeleteUser).patch(UpdateUser);
export default router ; 
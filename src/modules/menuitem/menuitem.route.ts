import { Router } from "express";
import {
  CreateNewItem,
  GetAllMenuItems,
  DeleteMenuItem,
  UpdateMenuItem,
  GetMenuItemByID,
  GetAllMenuItemsAdmin,
} from "./menuitem.controller";
import {
  restirectCustomers,
  adminsOnly,
  protectRoute,
} from "../../common/middelware/auth.middleware";
import { CheckChiefExists } from "../../common/middelware/chiefs.middleware";

const router = Router();

// !IMPORTANT This route is for admins only !!!
router.route("/").get(protectRoute, adminsOnly, GetAllMenuItemsAdmin);

router
  .route("/chief/:chiefid/")
  .get(protectRoute, CheckChiefExists, GetAllMenuItems)
  .post(protectRoute, restirectCustomers, CheckChiefExists, CreateNewItem);

router
  .route("chief/:chiefid/:id")
  .patch(protectRoute, restirectCustomers, UpdateMenuItem)
  .get(protectRoute, CheckChiefExists, GetMenuItemByID)
  .delete(protectRoute, restirectCustomers, CheckChiefExists, DeleteMenuItem);

export default router;

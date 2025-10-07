import { Router } from "express";
import {
  CreateNewItem,
  GetAllMenuItems,
  DeleteMenuItem,
  UpdateMenuItem,
  GetMenuItemByID,
  GetAllMenuItemsAdmin,
} from "./menuitem.controller";
import { protectRoute } from "../../common/middelware/auth.middleware";
import { Role } from "@prisma/client";
import restrictTo from "../../common/middelware/restrictTo";

const router = Router();

//ADMIN ONLY ROUTE
router
  .route("/")
  .get(protectRoute, restrictTo(Role.ADMIN), GetAllMenuItemsAdmin);

router
  .route("/chef/:chefid/")
  .get(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), GetAllMenuItems)
  .post(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), CreateNewItem);

router
  .route("chef/:chefid/:id")
  .patch(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), UpdateMenuItem)
  .get(protectRoute, GetMenuItemByID)
  .delete(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), DeleteMenuItem);

export default router;

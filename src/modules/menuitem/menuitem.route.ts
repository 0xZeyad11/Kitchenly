import { Router } from "express";
import {
  CreateNewItem,
  GetAllMenuItems,
  DeleteMenuItem,
  UpdateMenuItem,
  GetAllMenuItemsAdmin,
} from "./menuitem.controller";
import { protectRoute } from "../../common/middelware/auth.middleware";
import { Role } from "@prisma/client";
import restrictTo from "../../common/middelware/restrictTo";

const router = Router();

//ADMIN ONLY ROUTE
router
  .route("/admin")
  .get(protectRoute, restrictTo(Role.ADMIN), GetAllMenuItemsAdmin);

// CHEFS ROUTES //
router
  .route("/")
  .post(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), CreateNewItem)
  .get(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), GetAllMenuItems);

router
  .route("/:id")
  .patch(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), UpdateMenuItem)
  .delete(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), DeleteMenuItem);

///////////////////////////////////////////////////////////

// PUBLIC  //

router.route("/public/:chefid").get(protectRoute, GetAllMenuItems);

export default router;

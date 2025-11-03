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
import { uploadSingle } from "../../common/middelware/upload.middleware";

const router = Router();

router.route("/public/:chefid").get(protectRoute, GetAllMenuItems);
//ADMIN ONLY ROUTE
router
  .route("/admin")
  .get(protectRoute, restrictTo(Role.ADMIN), GetAllMenuItemsAdmin);

// CHEFS ROUTES //
router
  .route("/")
  .post(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), uploadSingle("image"), CreateNewItem)
  .get(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), GetAllMenuItems);

// PUBLIC  //
///////////////////////////////////////////////////////////
router
  .route("/:id")
  .patch(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), uploadSingle("image"), UpdateMenuItem)
  .delete(protectRoute, restrictTo(Role.ADMIN, Role.CHEF), DeleteMenuItem);

export default router;

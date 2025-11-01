import { Router } from "express";
import {
  DeleteUser,
  GetAllChiefs,
  GetAllCustomers,
  GetAllUsers,
  GetUser,
  Logout,
  UpdateUser,
  SetUserLocation,
  GetNearbyChefs,
  GetNearestChefs
} from "./user.controller";
import {
  login,
  signup,
  protectRoute,
  resetPassword,
  forgotPassword,
  GetMe,
} from "../../common/middelware/auth.middleware";


import restrictTo from "../../common/middelware/restrictTo";
import { Role } from "@prisma/client";
import { setUserLocation } from "./user.repository";

const router = Router();

// TODO : Remove Individual restrict functions and replace with a single function that takes an array of allowed user types
router.route("/").get(protectRoute, restrictTo(Role.ADMIN), GetAllUsers);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(Logout);
router.route("/me").get(protectRoute, GetMe);

router.route("/location/:userid").post(SetUserLocation).get(protectRoute, GetNearbyChefs);
router.route("/location/:userid/nearest").get(protectRoute, GetNearestChefs);

router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").patch(resetPassword);

router.route("/chiefs").get(protectRoute, GetAllChiefs);
router.route("/customers").get(protectRoute, restrictTo(Role.ADMIN), GetAllCustomers);

router.route("/:id").get(GetUser).delete(DeleteUser).patch(UpdateUser);
export default router;


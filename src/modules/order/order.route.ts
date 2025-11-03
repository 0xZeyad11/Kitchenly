import { protectRoute } from "../../common/middelware/auth.middleware";
import {
  CreateNewOrder,
  DeleteOrder,
  GetAllOrders,
  GetAllOrdersChef,
} from "./order.controller";
import { Router } from "express";
import { uploadSingle } from "../../common/middelware/upload.middleware";

const router = Router();
router.use(protectRoute);
router.route("/").post(uploadSingle("image"), CreateNewOrder).get(GetAllOrders);
router.route("/chef").get(GetAllOrdersChef);
router.route("/:id").delete(DeleteOrder);

export default router;

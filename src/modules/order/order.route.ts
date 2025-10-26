import { protectRoute } from "../../common/middelware/auth.middleware";
import { CreateNewOrder, DeleteOrder, GetAllOrders } from "./order.controller";
import { Router } from "express";

const router = Router();
router.use(protectRoute);
router.route("/").post(CreateNewOrder).get(GetAllOrders);
router.route("/:id").delete(DeleteOrder);
export default router;

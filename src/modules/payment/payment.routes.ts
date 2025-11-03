import { Router } from "express";
import {
  CreatePaymentSession,
  HandleWebhook,
  GetPaymentStatus,
} from "./payment.controller";
import { protectRoute } from "../../common/middelware/auth.middleware";
import express from "express";

const router = Router();

// Webhook route - must use raw body, so we apply express.raw middleware
// This route should NOT have JSON parsing middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  HandleWebhook,
);

// Protected routes - require authentication
router.use(protectRoute);

// Create payment session
router.post("/create-session", CreatePaymentSession);

// Get payment status for an order
router.get("/:orderId/status", GetPaymentStatus);

export default router;

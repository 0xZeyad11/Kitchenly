import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../common/utils/catchAsync";
import AppError from "../../common/utils/AppError";
import { apiResponse } from "../../common/utils/ApiResponse";
import {
  createPaymentSession,
  handleWebhookEvent,
  getPaymentStatus,
  constructWebhookEvent,
} from "./payment.service";

export const CreatePaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return next(
        new AppError("Order ID and amount are required", 400),
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return next(
        new AppError("Amount must be a positive number", 400),
      );
    }

    const session = await createPaymentSession(orderId, amount);
    
    apiResponse(
      res,
      "success",
      200,
      session,
      "Payment session created successfully",
    );
  },
);

export const HandleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return next(
        new AppError("Missing stripe-signature header", 400),
      );
    }

    // Get raw body for webhook verification
    const payload = req.body;

    try {
      const event = constructWebhookEvent(payload, signature);
      await handleWebhookEvent(event);

      // Return 200 to acknowledge receipt of the event
      res.status(200).json({ received: true });
    } catch (error) {
      return next(error);
    }
  },
);

export const GetPaymentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    if (!orderId) {
      return next(
        new AppError("Order ID is required", 400),
      );
    }

    const paymentStatus = await getPaymentStatus(orderId);
    
    apiResponse(
      res,
      "success",
      200,
      paymentStatus,
      "Payment status retrieved successfully",
    );
  },
);

import Stripe from "stripe";
import prisma from "../../../prisma/db";
import AppError from "../../common/utils/AppError";
import { sendPrismaError } from "../../common/middelware/errorhandler.middleware";

// Lazy initialization of Stripe to avoid errors when env variable is not set
let stripe: Stripe | null = null;

const getStripeInstance = (): Stripe => {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      throw new AppError(
        "Stripe API key not configured. Please set STRIPE_SECRET_KEY in environment variables.",
        500
      );
    }
    
    stripe = new Stripe(apiKey, {
      apiVersion: "2025-10-29.clover",
    });
  }
  
  return stripe;
};

export const createPaymentSession = async (orderId: string, amount: number) => {
  try {
    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        chef: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Create Stripe payment intent
    const paymentIntent = await getStripeInstance().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: orderId,
        customerId: order.customer_id,
        chefId: order.chef_id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: "pending",
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw sendPrismaError(error);
  }
};

export const handleWebhookEvent = async (
  event: Stripe.Event,
): Promise<void> => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          throw new AppError("Order ID not found in payment metadata", 400);
        }

        // Update order status on successful payment
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "succeeded",
            order_status: "ACCEPTED",
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "failed",
            },
          });
        }
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "canceled",
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    throw sendPrismaError(error);
  }
};

export const getPaymentStatus = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        paymentIntentId: true,
        paymentStatus: true,
        order_status: true,
        total_price: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw sendPrismaError(error);
  }
};

export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string,
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  
  if (!webhookSecret) {
    throw new AppError("Stripe webhook secret not configured", 500);
  }

  try {
    return getStripeInstance().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    throw new AppError(`Webhook signature verification failed: ${error}`, 400);
  }
};

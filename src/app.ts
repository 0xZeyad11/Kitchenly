import express, { Response, Request, NextFunction } from "express";
import userRoute from "./modules/user/user.route";
import menuRoute from "./modules/menuitem/menuitem.route";
import ordersRoute from "./modules/order/order.route";
import paymentRoute from "./modules/payment/payment.routes";
import { globalErrorHandler } from "./common/middelware/errorhandler.middleware";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import path from "path";

const app = express();
app.use(helmet());
app.use(globalErrorHandler);
app.use(cors());
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests from this ip, please try again later in one hour !!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(xss());
app.use(hpp());
// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/menuitem", menuRoute);
app.use("/api/v1/orders", ordersRoute);
app.use("/api/v1/payment", paymentRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to the root server endpoint",
  });
});

export default app;

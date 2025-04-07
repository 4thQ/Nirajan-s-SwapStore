import { Router } from "express";
import orderController from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const orderRouter = Router();

orderRouter.post("/buy", authMiddleware, orderController.buyOrder);

orderRouter.post("/rent", authMiddleware, orderController.rentOrder);

orderRouter.post("/swap", authMiddleware, orderController.swapOrder);

orderRouter.get("/my-orders", authMiddleware, orderController.getMyOrders);
orderRouter.get("/my-sales", authMiddleware, orderController.getMySales);
orderRouter.put("/update", authMiddleware, orderController.updateOrderStatus);
orderRouter.get("/notifications", authMiddleware, orderController.getNotifications);
orderRouter.get(
  "/notifications/markAsRead",
  authMiddleware,
  orderController.markNotificationsAsRead
);
export default orderRouter;

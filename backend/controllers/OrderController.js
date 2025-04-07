import Item from "../models/itemModel.js";
import Order from "../models/orderModel.js";
import { ErrorService } from "../services/ErrorService.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import sendMail, { generateOrderEmailHtml } from "../services/mailer.js";

class OrderController {
  async buyOrder(req, res, next) {
    const buyerId = req.userID;
    const { itemId, message, address, phoneNumber } = req.body;
    try {
      const item = await Item.findById(itemId);
      if (!item) return next(ErrorService.notFoundError("Item not found."));

      const buyer = await User.findById(buyerId);
      if (!buyer) return next(ErrorService.notFoundError("Buyer not found."));

      const seller = await User.findById(item.owner);
      if (!seller) return next(ErrorService.notFoundError("Seller not found."));

      const amount = item?.discount ? item?.discount : item?.price;

      const order = new Order({
        item: itemId,
        buyer: buyerId,
        seller: item.owner,
        type: "buy",
        message,
        amount,
        address,
        phoneNumber,
      });

      await Notification.create({
        userId: item.owner,
        message: `You have a new buy order for ${item.name} from ${buyer.firstName} ${buyer.lastName}.`,
        senderId: buyerId,
      });

      await order.save();
      const html = generateOrderEmailHtml(
        {
          _id: order?._id,
          type: "buy",
          itemName: item.name,
          amount,
          address,
          phoneNumber,
        },
        {
          firstName: seller?.firstName,
          lastName: seller?.lastName,
        }
      );

      await sendMail({
        to: seller?.email,
        subject: "Buy Order Placed",
        html,
      });

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      next(error);
    }
  }

  async rentOrder(req, res, next) {
    const buyerId = req.userID;
    const { itemId, rentDuration, message, address, phoneNumber } = req.body;
    try {
      const item = await Item.findById(itemId);
      if (!item) return next(ErrorService.notFoundError("Item not found."));

      const buyer = await User.findById(buyerId);
      if (!buyer) return next(ErrorService.notFoundError("Buyer not found."));

      const seller = await User.findById(item.owner);
      if (!seller) return next(ErrorService.notFoundError("Seller not found."));

      const amount = item.rentPerDay * rentDuration;

      const order = new Order({
        item: itemId,
        buyer: buyerId,
        seller: item.owner,
        type: "rent",
        rentDuration,
        message,
        amount,
        phoneNumber,
        address,
      });

      await Notification.create({
        userId: item.owner,
        message: `You have a new rent order for ${item.name} from ${buyer.firstName} ${buyer.lastName} for ${rentDuration} days.`,
        senderId: buyerId,
      });

      await order.save();
      const html = generateOrderEmailHtml(
        {
          _id: order?._id,
          type: "rent",
          itemName: item.name,
          amount,
          address,
          phoneNumber,
          numberOfDays: rentDuration,
          perDayRent: item.rentPerDay,
        },
        {
          firstName: seller?.firstName,
          lastName: seller?.lastName,
        }
      );

      await sendMail({
        to: seller?.email,
        subject: "Rent Order Placed",
        html,
      });
      res.status(201).json({ message: "Rent order placed successfully", order });
    } catch (error) {
      next(error);
    }
  }

  async swapOrder(req, res, next) {
    const buyerId = req.userID;
    const { itemId, swapWith, message, address, phoneNumber } = req.body;
    try {
      const item = await Item.findById(itemId);
      if (!item) return next(ErrorService.notFoundError("Item not found."));

      const buyer = await User.findById(buyerId);
      if (!buyer) return next(ErrorService.notFoundError("Buyer not found."));

      const seller = await User.findById(item.owner);
      if (!seller) return next(ErrorService.notFoundError("Seller not found."));

      const swapItem = await Item.findById(swapWith);
      if (!swapItem) return next(ErrorService.notFoundError("Swap item not found."));

      const order = new Order({
        item: itemId,
        buyer: buyerId,
        seller: item.owner,
        type: "swap",
        swapItem: swapWith,
        message,
        address,
        phoneNumber,
      });

      await Notification.create({
        userId: item.owner,
        message: `You have a new swap order for ${item.name} from ${buyer.firstName} ${buyer.lastName}.`,
        senderId: buyerId,
      });

      await order.save();
      const html = generateOrderEmailHtml(
        {
          _id: order?._id,
          type: "swap",
          itemName: item.name,
          address,
          phoneNumber,
          swapWith: swapItem.name,
        },
        {
          firstName: seller?.firstName,
          lastName: seller?.lastName,
        }
      );
      await sendMail({
        to: seller?.email,
        subject: "Swap Order Placed",
        html,
      });
      res.status(201).json({ message: "Swap order placed successfully", order });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    const userId = req.userID;

    try {
      const myOrders = await Order.find({ buyer: userId })
        .populate("item")
        .populate("swapItem")
        .populate("seller", "firstName lastName  email")
        .sort({ createdAt: -1 })
        .exec();

      res.status(200).json({ orders: myOrders });
    } catch (error) {
      next(error);
    }
  }

  async getMySales(req, res, next) {
    const userId = req.userID;

    try {
      const mySales = await Order.find({ seller: userId })
        .populate("item")
        .populate("swapItem")
        .populate("buyer", "firstName lastName  email")
        .sort({ createdAt: -1 })
        .exec();

      res.status(200).json({ sales: mySales });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    const { status, orderId } = req.body;
    const userId = req.userID;

    try {
      const validStatuses = ["pending", "accepted", "canceled"];
      if (!validStatuses.includes(status)) {
        return next(ErrorService.badRequest("Invalid status value."));
      }

      const order = await Order.findById(orderId).populate("item").populate("swapItem");
      if (!order) return next(ErrorService.notFoundError("Order not found."));

      if (order.item.owner.toString() !== userId) {
        return next(
          ErrorService.forbidden(
            "You do not have permission to update this order status."
          )
        );
      }

      order.status = status;

      if (status === "accepted") {
        const item = await Item.findById(order.item._id);
        if (!item) return next(ErrorService.notFoundError("Item not found."));

        switch (order.type) {
          case "buy":
            item.status = "sold";
            break;
          case "rent":
            item.status = "rented";
            break;
          case "swap":
            item.status = "swapped";

            const swapItem = await Item.findById(order.swapItem._id);
            if (!swapItem)
              return next(ErrorService.notFoundError("Swap item not found."));

            swapItem.status = "swapped";
            await swapItem.save();
            break;
          default:
            return next(ErrorService.badRequest("Unknown order type."));
        }

        await item.save();
      }

      await order.save();
      // TODO: SEND MESSAGE TO USER.. NOTIFY
      const customer = await User.findById(order.buyer);
      if (customer) {
        const notification = new Notification({
          userId: customer._id,
          message: `Your order with item ID ${order.item._id} has been ${status}.`,
          senderId: userId,
        });
        await notification.save();

        await sendMail({
          to: customer.email,
          subject: "Order Status Update",
          html: `<p>Your order with item ID ${order.item._id} has been <strong>${status}</strong>.</p>`,
        });
      }

      res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const userId = req.userID;
      console.log(userId);
      const notifications = await Notification.find({ userId: userId.toString() })
        .populate("senderId")
        .sort({ createdAt: -1 })
        .exec();
      const unreadCount = await Notification.countDocuments({
        userId: userId,
        isRead: false,
      });
      res.json({ notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  }

  async markNotificationsAsRead(req, res, next) {
    const userID = req.userID;
    try {
      await Notification.updateMany(
        { userId: userID, isRead: false },
        { $set: { isRead: true } }
      );
      const updatedNotifications = await Notification.find({
        userId: userID,
        isRead: true,
      }).sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ message: "Mark read successfully", updatedNotifications });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();
export default orderController;

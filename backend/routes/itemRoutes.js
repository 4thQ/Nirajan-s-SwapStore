import { Router } from "express";
import itemController from "../controllers/ItemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const itemRouter = Router();

itemRouter.post("/", authMiddleware, upload.array("images", 5), itemController.addItem);
itemRouter.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  itemController.editItem
);
itemRouter.delete(
  "/:id",
  authMiddleware,

  itemController.deleteItem
);
itemRouter.get("/", itemController.getItems);
itemRouter.get("/my-items", authMiddleware, itemController.getItemsByOwner);
itemRouter.get("/recents", itemController.getRecentsItems);
itemRouter.get("/details/:id", itemController.getItemDetials);
itemRouter.get("/seller", itemController.getSellerItems);
itemRouter.post("/wishlists", authMiddleware, itemController.toggleWishList);
itemRouter.get("/wishlists", authMiddleware, itemController.getWishList);

export default itemRouter;

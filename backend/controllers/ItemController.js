import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import Wishlist from "../models/wishlistModel.js";
import { ErrorService } from "../services/ErrorService.js";
import uploadFile from "../services/uploadFile.js";
import { addItemSchema } from "../validators/index.js";

class ItemController {
  async addItem(req, res, next) {
    if (req.body.type) {
      req.body.type = JSON.parse(req.body.type);
    }
    const { error, value } = addItemSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(error);
    }
    try {
      const uploadedImages = await Promise.all(req.files.map(uploadFile));
      const newItem = new Item({
        ...value,
        owner: req.userID,
        images: uploadedImages,
      });

      await newItem.save();

      res.status(201).json({
        message: "Item added successfully!",
        item: newItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async editItem(req, res, next) {
    try {
      if (req.body.type) {
        req.body.type = JSON.parse(req.body.type);
      }
      const { error, value } = addItemSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next(error);
      }
      const itemId = req.params.id;
      const item = await Item.findById(itemId);

      if (!item) {
        return next(ErrorService.notFoundError("Item not found."));
      }

      // Check if the authenticated user is the owner of the item
      if (item.owner.toString() !== req.userID) {
        return next(ErrorService.forbiddenError("Unauthorized to update this item"));
      }
      let uploadedImages = item.images;
      if (req.files && req.files.length > 0) {
        uploadedImages = await Promise.all(req.files.map(uploadFile));
      }

      Object.assign(item, {
        ...value,
        images: uploadedImages,
      });

      await item.save();

      res.status(200).json({
        message: "Item updated successfully!",
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const itemId = req.params.id;
      const item = await Item.findById(itemId);

      if (!item) {
        return next(ErrorService.notFoundError("Item not found."));
      }

      if (item.owner.toString() !== req.userID) {
        return next(ErrorService.forbiddenError("Unauthorized to update this item"));
      }

      await Item.findByIdAndDelete(itemId);

      res.status(200).json({ message: "Item deleted successfully!" });
    } catch (error) {
      next(error);
    }
  }

  async getItems(req, res, next) {
    try {
      const { category, type, brand, condition, search, color, sortBy } = req.query;

      const query = {
        status: "available",
      };

      if (category) {
        query.category = category;
      }
      if (color) {
        query.color = color;
      }

      if (type) {
        const validTypes = ["buy", "rent", "swap"];
        if (validTypes.includes(type)) {
          query["type." + type] = true;
        }
      }

      if (brand) {
        query.brand = brand;
      }

      if (condition) {
        query.condition = condition;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      const sortOptions = {};
      if (sortBy) {
        switch (sortBy) {
          case "price-asc":
            sortOptions.price = 1;
            break;
          case "price-desc":
            sortOptions.price = -1;
            break;
          case "newest":
            sortOptions.createdAt = -1;
            break;
          case "oldest":
            sortOptions.createdAt = 1;
            break;
          default:
            sortOptions.createdAt = -1;
            break;
        }
      }

      const items = await Item.find(query).sort(sortOptions).exec();

      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }

  async getItemsByOwner(req, res, next) {
    const { q } = req.query;
    try {
      const items = await Item.find({ owner: req.userID, status: "available" }).sort({
        createdAt: -1,
      });
      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

  async getItemDetials(req, res, next) {
    try {
      const item = await Item.findById(req.params.id).populate("owner");

      if (!item) {
        return next(ErrorService.notFoundError("Item not found."));
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async getRecentsItems(req, res, next) {
    const { userID } = req.query;
    try {
      const baseQuery = {
        status: "available",
      };
      // if (userID && userID !== "undefined") {
      //   baseQuery.owner = { $ne: userID };
      // }
      const recentBuyItems = await Item.find({
        ...baseQuery,
        "type.buy": true,
      })
        .sort({ createdAt: -1 })
        .limit(3);

      const recentRentItems = await Item.find({
        ...baseQuery,
        "type.rent": true,
      })
        .sort({ createdAt: -1 })
        .limit(3);

      const recentSwapItems = await Item.find({
        ...baseQuery,
        "type.swap": true,
      })
        .sort({ createdAt: -1 })
        .limit(3);

      const recentItems = {
        buy: recentBuyItems,
        rent: recentRentItems,
        swap: recentSwapItems,
      };

      res.status(200).json(recentItems);
    } catch (error) {
      next(error);
    }
  }

  async getSellerItems(req, res, next) {
    const { userID } = req.query;
    try {
      const user = await User.findById(userID);
      if (!user) {
        return next(ErrorService.notFoundError("User not found."));
      }
      const items = await Item.find({ owner: userID, status: "available" }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        items,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleWishList(req, res, next) {
    try {
      const { itemId } = req.body;
      const userId = req.userID;

      // Log incoming data
      console.log("ITEM ID:", itemId);
      console.log("USER ID:", userId);

      // Check if userId and itemId are valid
      if (!userId || !itemId) {
        return res.status(400).json({ error: "Invalid userId or itemId" });
      }

      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        const newWishlist = new Wishlist({
          userId,
          items: [itemId],
        });
        await newWishlist.save();
        return res.json({ isInWishlist: true });
      }

      if (wishlist.items.includes(itemId)) {
        await Wishlist.updateOne({ userId }, { $pull: { items: itemId } });
        return res.json({ isInWishlist: false });
      } else {
        await Wishlist.updateOne({ userId }, { $push: { items: itemId } });
        return res.json({ isInWishlist: true });
      }
    } catch (error) {
      console.error("Error in toggleWishList:", error);
      next(error);
    }
  }

  async getWishList(req, res, next) {
    try {
      const userId = req.userID;
      const wishlist = await Wishlist.findOne({ userId }).populate("items");
      const items = wishlist?.items || [];
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
}

const itemController = new ItemController();

export default itemController;

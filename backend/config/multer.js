import multer from "multer";
import path from "path";
import { ROOT_PATH } from "../index.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(ROOT_PATH, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.random() * 1e9}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

export default upload;

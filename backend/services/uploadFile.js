import { ROOT_PATH } from "../index.js";
import path from "path";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadFile = async (file) => {
  const fileName = file.filename;
  const filePath = path.resolve(ROOT_PATH, "uploads", fileName);
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
  });
  //   remove image
  await fs.promises.unlink(filePath);

  return uploadResult.secure_url;
};

export default uploadFile;

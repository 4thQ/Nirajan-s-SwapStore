import mongoose from "mongoose";
import config from "./index.js";

export const connectDatabase = async () => {
  mongoose
    .connect(config.DB_URL)
    .then(() => {
      console.log("Database connected successfully 🚀🚀");
    })
    .catch((err) => {
      console.log(
        `Something went wrong while connecting to database 😢😢: ${err}`
      );
      process.exit(1);
    });
};

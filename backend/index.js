import express from "express";
import config from "./config/index.js";
import { connectDatabase } from "./config/database.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
const PORT = config.PORT || 5000;
const corsOptions = {
  credentials: true,
  origin: [config.WEBSITE_DOMAIN, config.DASHBOARD_DOMAIN],
};

/* ABSOLUTE PATH OF BACKEND FOLDER */
const __filename = fileURLToPath(import.meta.url);
export const ROOT_PATH = path.dirname(__filename);

app.use(express.json({ limit: "5mb" }));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Register Routes
app.get("/", (req, res) => {
  return res.send("<h1>Welcome to Swapstore API </h1>");
});
app.use("/api", router);
app.use("/api/items", itemRouter);
app.use("/api/orders", orderRouter);
// Error Handler Middleware
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is listning on port ${PORT}`);
    });
  } catch (error) {
    console.log(
      `Something went wrong 😢😢: ${
        config.DEBUG_MODE === "true" ? error : "Internal Server Error"
      }`
    );
  }
};

startServer();

export default app;

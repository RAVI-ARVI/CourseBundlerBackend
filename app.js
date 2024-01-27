import { config } from "dotenv";
import express from "express";

config({
  path: "./Config/config.env",
});
connectDB();
const app = express();

//Using  Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//Importing and Using Router

import cookieParser from "cookie-parser";
import { connectDB } from "./Config/database.js";
import { ErrorMiddleware } from "./middlewares/Error.js";
import courseRoute from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
app.use(cookieParser());
app.use("/api/v1", courseRoute);
app.use("/api/v1", userRoutes);

export default app;

app.use(ErrorMiddleware);

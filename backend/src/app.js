import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CROSS_KEY,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" })); // req.body se data max size  16kb. data json me hoga jo frontent se aayaga
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //yaha data html ke rup me aata hai usko samhe ke liye.
app.use(express.static("public"));

app.use(cookieParser());

import registerRouter from "./router/user.router.js";
import loginRouter from "./router/user.router.js";
import logoutRouter from "./router/user.router.js";
import updateDetailRouter from "./router/user.router.js";
import updatePasswordRouter from "./router/user.router.js";
import refreshAccessTokenRouter from "./router/user.router.js";
import getUserRouter from "./router/user.router.js";

app.use("/api/v1/users", registerRouter);
app.use("/api/v1/users", loginRouter);

app.use("/api/v1/users", logoutRouter);
app.use("/api/v1/users", updateDetailRouter);

app.use("/api/v1/users", updatePasswordRouter);
app.use("/api/v1/users", refreshAccessTokenRouter);

app.use("/api/v1/users", getUserRouter);

export default app;

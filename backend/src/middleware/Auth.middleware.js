import asynchandler from "../util/AsyncHandler.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../util/ApiError.js";
const VerifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorization request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Invaild token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invailed access token");
  }
});

export default VerifyJWT;

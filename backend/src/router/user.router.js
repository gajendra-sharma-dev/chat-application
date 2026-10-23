import { Router } from "express";
import {
  registerUser,
  getUser,
  loginUser,
  logout,
  refreshAccessToken,
  UpdateUserDetail,
  updatePassword,
  searchUsers,
} from "../controllers/user.controllers.js";
import VerifyJWT from "../middleware/Auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", VerifyJWT, loginUser);
router.post("/logout", VerifyJWT, logout);
router.get("/getUser", VerifyJWT, getUser);
router.patch("/updatepassword", VerifyJWT, updatePassword);
router.patch("/update", VerifyJWT, UpdateUserDetail);
router.patch("/updateaccessToken", refreshAccessToken);
router.get("/search", VerifyJWT, searchUsers);

export default router;

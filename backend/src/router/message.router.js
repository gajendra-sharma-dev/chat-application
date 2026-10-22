import { Router } from "express";
import {
  sendMessage,
  getMessages,
} from "../controllers/message.controllers.js";
import VerifyJWT from "../middleware/Auth.middleware.js";
const router = Router();

router.use(VerifyJWT);

router.route("/message/:roomId").post(sendMessage);
router.route("/message/:roomId").get(getMessages);

export default router;

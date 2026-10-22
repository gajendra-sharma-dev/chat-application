import { Router } from "express";
import {
  createRoom,
  createRoomGroup,
  getMyallroom,
  getRoomById,
  addMembersInroom,
  leaveRoom,
} from "../controllers/room.controllers.js";
import VerifyJWT from "../middleware/Auth.middleware.js";
const router = Router();

router.use(VerifyJWT);

router.route("/createRoom").post(createRoom);
router.route("/createGroup").post(createRoomGroup);
router.route("/getallroom").get(getMyallroom);
router.route("/:roomId").get(getRoomById);
router.route("/:roomId").post(addMembersInroom);
router.route("/:roomId").patch(leaveRoom);

export default router;

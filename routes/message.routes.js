import express from "express";
import message from "../controllers/message.controller.js";
import auth from '../auth/verify.js'
const router = express.Router();

router
  .get("/:roomId", auth, message.getAllMessages)
  .post("/", auth, message.createMessage)
  .get("/:id", auth, message.getOneMessage)
  .delete("/:id", auth, message.deleteOneMessage);

export default router;

import express from "express";
import user from "../controllers/user.controller.js";
import auth from "../auth/verify.js";
import login from "../auth/auth.js";
const router = express.Router();

router
  .post("/login", login)
  .post("/", user.createUser)
  .get("/", auth, user.getAllUsers)
  .get("/:id", auth, user.getOneUser)
  .delete("/:id", auth, user.deleteOneUser);

export default router;

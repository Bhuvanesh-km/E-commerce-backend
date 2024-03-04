const express = require("express");
const userRouter = express.Router();

const {
  getUserHandler,
  createUserHandler,
  getUserByIdHandler,
  updateUserById,
  deleteUserById,
  checkInput,
} = require("../controllers/userController");

const { protectRoute, isAdmin } = require("../controllers/authController");

userRouter.use(protectRoute);
userRouter.get("/", isAdmin, getUserHandler);
userRouter.post("/", checkInput, createUserHandler);
userRouter.get("/:id", getUserByIdHandler);
userRouter.delete("/:id", deleteUserById);
userRouter.patch("/:id", updateUserById);
// userRouter.patch("/reset-password", resetPassword);
// userRouter.post("/forgot-password", forgotPassword);

module.exports = userRouter;

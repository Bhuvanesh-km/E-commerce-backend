const express = require("express");

const authRouter = express.Router();

const {
  forgotPassword,
  resetPassword,
  loginHandler,
  signUpHandler,
  logoutHandler,
} = require("../controllers/authController");
const { checkInput } = require("../utils/createFractory");

authRouter.post("/signup", checkInput, signUpHandler);
authRouter.post("/login", checkInput, loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.post("/forgot-password", checkInput, forgotPassword);
authRouter.patch("/reset-password", resetPassword); //re-check this route

module.exports = authRouter;

const User = require("../models/userModel");
const { emailBuilder } = require("../nodeMailer");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey123123";
const bycrypt = require("bcrypt");

const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      const userId = decoded.data;
      req.userId = userId; // manipulating request object
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6 digit number range 100000 - 999999
};

const forgotPassword = async (req, res) => {
  try {
    //user sends their email
    const email = req.body.email;
    //check if the email exists in the database
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    //generate otp
    const otp = otpGenerator();
    //store the otp in the database
    user.token = otp.toString();
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    //send the otp to the user's email
    emailBuilder(user.email, "Password reset OTP", `Your OTP is ${otp}`)
      .then((info) => {
        res.status(200).json({
          status: "success",
          message: "OTP sent to your email",
        });
      })
      .catch((error) => {
        console.log(error.message);
        throw new Error({ status: "fail", message: "Error sending email" });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 500,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  //user sends their token and new password
  //verify the token is valid
  //update the user password
  try {
    const { email, otp, password } = req.body;
    //check if the email exists in the database
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    //check if the otp is valid
    if (user.token !== otp) {
      throw new Error("Invalid OTP");
    } else {
      if (Date.now() > user.otpExpires) {
        throw new Error("OTP expired");
      }
    }
    //update the password
    user.password = password;
    user.token = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  //validate the user credentials
  //if valid, create a token and send it to the client
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // if (user.password !== password) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }
    jwt.sign(
      { data: user._id },
      SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true, sameSite:'None' });
        res.status(200).json({
          message: "login successful",
          data: user,
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const signUpHandler = async (req, res) => {
  try {
    const userObj = req.body;
    console.log("UserObject", userObj);
    const user = await User.create(userObj);
    res.json({ message: "user created", user });
  } catch (error) {
    console.log(error);
  }
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "signed out" });
  } catch (error) {
    console.log(error);
  }
};

const isAuthorized = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (allowedRoles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({
          message: "Forbidden, you are not authorized to access this route",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = {
  protectRoute,
  forgotPassword,
  resetPassword,
  isAdmin,
  signUpHandler,
  logoutHandler,
  loginHandler,
  isAuthorized,
};

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const mongoose = require("mongoose");
require("dotenv").config();

const SECRET_KEY = "secretkey123123";

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.DB_URL)
  .then((connection) => console.log("DB connected"))
  .catch((err) => console.log("DB connection failed"));

app.get("/", (req, res) => {
  res.cookie("pageVisited", "Home", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  res.json({
    message: "Welcome to home page",
  });
});

app.get("/products", (req, res) => {
  console.log(req.cookies);
  res.cookie("products", "bestSeller", {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    path: "/products",
  });
  const { pageVisited } = req.cookies;
  if (pageVisited) {
    res.status(200).json({
      message: "Welcome to home page",
    });
  } else {
    res.status(200).json({
      message: "Visiting for first time",
    });
  }
});

app.get("/clearCookies", (req, res) => {
  res.clearCookie("pageVisited", { path: "/products" });
  res.json({ message: "cookies cleared" });
});

app.get("/signin", async (req, res) => {
  const payload = 1234;
  try {
    jwt.sign(
      { data: payload },
      SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        res.status(200).json({ message: "signed in", token: token });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      }
      res.status(200).json({ message: "Authorized", decoded: decoded });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signUp", async (req, res) => {
  try {
    const userObj = req.body;
    console.log("UserObject", userObj);
    const user = await User.create(userObj);
    res.json({ message: "user created", user });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  //validate the user credentials
  //if valid, create a token and send it to the client
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    jwt.sign({ data: user }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.log(err);
      }
      res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
      res.status(200).json({ message: "signed in", token });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/signOut", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "signed out" });
  } catch (error) {
    console.log(error);
  }
});

const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.data);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

app.get("/userData", protectRoute, (req, res) => {
  res.status(200).json({
    message: "User data fetched successfully",
    data: req.user,
  });
});

app.listen(3000, () => {
  console.log("server started");
});

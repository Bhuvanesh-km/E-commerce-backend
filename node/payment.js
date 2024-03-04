const express = require("express");
const razorpay = require("razorpay");
const shortId = require("short-uuid");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const options = {
  amount: 20000, // amount in smallest currency unit (INR 500)
  currency: "INR",
  receipt: shortId.generate(),
};

// razorpayInstance.orders.create(options, (err, order) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(order);
// });

app.post("/checkout", async (req, res) => {
  const options = {
    amount: 50000,
    currency: "INR",
    receipt: shortId.generate(),
  };
  razorpayInstance.orders.create(options, (err, order) => {
    if (err) {
      console.log(err);
    }
    console.log(order);
    res.status(200).json({ message: "order created", data: order });
  });
});

app.post("/verify", (req, res) => {
  try {
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.status(200).json({ message: "ok" });
    } else {
      console.log("request is not legit");
      res.status(403).json({ message: "invalid signature" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

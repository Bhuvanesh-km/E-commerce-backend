const express = require("express");
const razorpay = require("razorpay");
const crypto = require("crypto");
const shortId = require("short-uuid");
const { protectRoute } = require("../controllers/authController");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Product = require("../models/productsModel");
const bookingRouter = express.Router();

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

bookingRouter.post("/", protectRoute, async (req, res) => {
  try {
    console.log("booking route hit");
    const { productsArray, priceAtBooking } = req.body;
    const { userId } = req;
    const bookingObj = {
      priceAtBooking,
      products: productsArray,
      user: userId,
      TotalItems: productsArray
        .map((product) => product.quantity)
        .reduce((a, b) => a + b, 0),
    };
    // console.log(bookingObj);
    // // create a booking
    const booking = await Booking.create(bookingObj);
    // console.log(booking);
    // update user with booking details
    const user = await User.findById(userId);
    // console.log(user);
    user.bookings.push(booking._id);
    await user.save();
    var options = {
      amount: priceAtBooking * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("order created", order);
    booking.paymentOrderId = order.id;
    await booking.save();
    res.status(200).json({
      status: "order created successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
  }
});

bookingRouter.get("/", protectRoute, async (req, res) => {
  const bookings = await Booking.find()
    .populate({ path: "user", select: "name email" })
    .populate({ path: "products", select: "name price" });
  if (bookings) {
    res.status(200).json({
      status: "success",
      data: bookings,
    });
  } else {
    res.status(404).json({
      status: "failed",
      message: "No bookings found",
    });
  }
});

bookingRouter.post("/verify", async (req, res) => {
  try {
    console.log("webhook hit", req.body);
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      const booking = await Booking.findOne({
        paymentOrderId: req.body.payload.payment.entity.order_id,
      });
      booking.status = "success";
      delete booking.paymentOrderId;
      await booking.save();
      res.status(200).json({ message: "ok" });
    } else {
      console.log("request is not legit");
      res.status(403).json({ message: "invalid signature" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = bookingRouter;

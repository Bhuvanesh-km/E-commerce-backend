const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  priceAtBooking: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  paymentOrderId: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

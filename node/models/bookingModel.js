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
  products: {
    type: [{ product: mongoose.Schema.Types.ObjectId, quantity: Number }],
    ref: "Product",
    required: true,
  },
  TotalItems: Number,
  paymentOrderId: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

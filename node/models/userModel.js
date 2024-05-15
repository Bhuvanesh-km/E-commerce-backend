const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    // validate: {
    //   validator: function () {
    //     return this.password === this.confirmPassword;
    //   },
    //   message: "password and confirm password should be same",
    // },
  },
  address: {
    type: String,
    // required: true,
  },
  token: String,
  otpExpires: Date,
  role: {
    type: String,
    default: "user",
  },
  bookings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Booking",
  },
});

const validRoles = ["admin", "user", "Seller"];

userSchema.pre("save", async function (next) {
  const { confirmPassword } = this;
  if (!confirmPassword) return next();
  if (this.password !== this.confirmPassword) {
    throw new Error("password and confirm password should be same");
  }
  this.confirmPassword = undefined;
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  console.log("password hashed", this.password, hashedPassword);
  if (this.role) {
    const isValid = validRoles.includes(this.role);
    if (!isValid) {
      throw new Error("Role should be either admin, user or Seller");
    } else {
      next();
    }
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

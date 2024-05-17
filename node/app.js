const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const PORT = process.env.PORT || 3000;

//routers
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productsRouter");
const authRouter = require("./routes/authRouter");
const bookingRouter = require("./routes/bookingRouter");
const reviewRouter = require("./routes/reviewRouter");

const app = express();
app.use(express.json());
app.use(
  cookieParser({
    sameSite: "none",
    secure: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  // standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// cors is used to allow the request from different domain name
// app.use(cors());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/** database connection starts */
mongoose
  .connect(process.env.DB_URL)
  .then((connection) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
/** database connection ends */

/** lets say the requested path is /api/user/123 */
app.use("/api/user", userRouter);
/** lets say the requested url is to delete a product with id abc ; url -> /api/product/abc*/
app.use("/api/product", productRouter);
/** lets say the requested url is to login ; url -> /api/auth/login*/
app.use("/api/auth", authRouter);
/** lets say the requested url is to book a product ; url -> /api/booking */
app.use("/api/booking", bookingRouter);
/** lets say the requested url is to review a product ; url -> /api/review */
app.use("/api/reviews", reviewRouter);

//central error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal server error";
  res.status(statusCode).json({
    status: statusCode,
    message: msg,
  });
});

// request not handled by any of the above routers will be handled here
app.use((req, res) => {
  res.sendStatus(404).send("404 not found");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

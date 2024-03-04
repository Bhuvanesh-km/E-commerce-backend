const express = require("express");

const reviewRouter = express.Router();
const Review = require("../models/reviewModel");
const { protectRoute } = require("../controllers/authController");
const Product = require("../models/productsModel");

reviewRouter.post("/:productId", protectRoute, async (req, res) => {
  /**
   * 1. get the product id from the params
   * 2. get the user id from the req object
   * 3. get the review and rating from the req.body
   * 4. update/add the review and rating to the product
   * 5. create a review object
   * 6. save the review object and push the review id to the product
   * 7. send the response
   */
  try {
    const { userId } = req;
    const { productId } = req.params;
    const { review, rating } = req.body;

    const reviewObj = await Review.create({
      review: review,
      rating: rating,
      user: userId,
      product: productId,
    });
    /** update review on the product */
    const productObj = await Product.findById(productId);
    console.log(productObj);
    const averageRating = productObj.averageRating;
    if (averageRating && productObj.reviews.length > 0) {
      const sum = averageRating * productObj.reviews.length; // 4.5 * 2 = 9
      const finalAverageRating =
        (sum + rating) / (productObj.reviews.length + 1); // (9 + 5) / 3 = 3
      productObj.averageRating = finalAverageRating;
    } else {
      productObj.averageRating = rating;
    }
    // console.log(reviewObj._id);
    productObj.reviews.push(reviewObj._id);
    await productObj.save();
    res.status(200).json({
      message: "review added successfully",
      data: reviewObj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
});

reviewRouter.get("/", protectRoute, async (req, res) => {});

module.exports = reviewRouter;

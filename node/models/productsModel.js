const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: [true, "Product name should be unique"],
    maxLength: [40, "Product name should not exceede 40 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function () {
        return this.price > 0;
      },
      message: "Price must be greater than 0",
    },
  },
  categories: {
    required: true,
    type: [String],
  },
  images: [String],
  averageRating: {
    type: Number,
    min: [0, "Rating should be greater than 1"],
    max: [5, "Rating should be less than 5"],
  },
  discount: {
    type: Number,
    validate: {
      validator: function () {
        return this.discount < this.price;
      },
      message: "Discount should be less than price",
    },
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    maxLength: [200, "Product description should not exceed 200 characters"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    validate: {
      validator: function () {
        return this.stock >= 0;
      },
      message: "Stock should be grater than equal to 0 ",
    },
  },
  brand: {
    type: String,
    required: [true, "Product brand is required"],
  },
  reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Review",
  },
});

const validCatogories = [
  "electronics",
  "men's clothing",
  "jewelery",
  "women's clothing",
];

productSchema.pre("save", function (next) {
  // console.log("pre save hook");
  const invalidCatogories = this.categories.filter((categorie) => {
    return !validCatogories.includes(categorie);
  });
  if (invalidCatogories.length) {
    return next(new Error(`Invalid categories ${invalidCatogories.join(",")}`));
  } else {
    next();
  }
});

// productSchema.post("save", function () {
// console.log("post save hook");
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

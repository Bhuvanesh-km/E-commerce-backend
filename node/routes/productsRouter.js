const express = require("express");
const productRouter = express.Router();

const {
  createProductHandler,
  getProductByIdHandler,
  deleteProductById,
  updateProductById,
  getPRoductCategories,
} = require("../controllers/productController");
const Product = require("../models/productsModel");

const { checkInput } = require("../utils/createFractory");
const { isAuthorized, protectRoute } = require("../controllers/authController");

//search handler
async function getProductsHandler(req, res) {
  const sortQuery = req.query.sort;
  const selectQuery = req.query.select;
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;
  const filterQuery = req.query.filter;
  //sort logic
  let queryResPromise = Product.find();
  if (sortQuery) {
    const [sortParms, order] = sortQuery.split(" ");
    if (order === "asc") {
      queryResPromise.sort(sortParms);
    } else {
      queryResPromise.sort(`-${sortParms}`);
    }
  }
  if (selectQuery) {
    queryResPromise = queryResPromise.select(selectQuery);
  }
  if (limit) {
    queryResPromise = queryResPromise.skip(skip).limit(limit);
  }
  if (filterQuery) {
    console.log("filter query", filterQuery);
    const filterObj = JSON.parse(filterQuery);
    const filterObjString = JSON.stringify(filterObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const filterObjFinal = JSON.parse(filterObjString);
    queryResPromise = queryResPromise.find(filterObjFinal);
  }
  const result = await queryResPromise;
  res.status(200).json({
    message: "search successful",
    data: result,
  });
}

async function getBigBillionProducts(req, res, next) {
  req.query.filter = JSON.stringify({ price: { gt: 10000 } });
  next();
}

const authorizedProductRoles = ["admin", "manager", "sales"];

productRouter.get("/search", getProductsHandler);
productRouter.get("/categories", getPRoductCategories);
productRouter.get("/", getProductsHandler);
productRouter.post(
  "/",
  checkInput,
  protectRoute,
  isAuthorized(authorizedProductRoles),
  createProductHandler
);
productRouter.get("/bigBillionDay", getBigBillionProducts, getProductsHandler);
productRouter.get("/:id", getProductByIdHandler);
productRouter.delete("/:id", deleteProductById);
productRouter.patch("/:id", updateProductById);

module.exports = productRouter;

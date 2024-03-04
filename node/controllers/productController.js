const Product = require("../models/productsModel");
const {
  getAllFactory,
  createFactory,
  getElementByIdFactory,
  deleteElementByIdFactory,
  updateElementByIdFactory,
} = require("../utils/createFractory");

//Route handler
const getProductHandler = getAllFactory(Product);
const createProductHandler = createFactory(Product);
const getProductByIdHandler = getElementByIdFactory(Product);
const deleteProductById = deleteElementByIdFactory(Product);
const updateProductById = updateElementByIdFactory(Product);
const getPRoductCategories = async (req, res) => {
  res.status(200).json({
    message: "Category found",
    data: ["electronics", "jewelery", "men's clothing", "women's clothing"],
  });
};

module.exports = {
  getProductHandler,
  createProductHandler,
  getProductByIdHandler,
  updateProductById,
  deleteProductById,
  getPRoductCategories,
};

const User = require("../models/userModel");
const {
  getAllFactory,
  createFactory,
  getElementByIdFactory,
  deleteElementByIdFactory,
  updateElementByIdFactory,
  checkInput,
} = require("../utils/createFractory");

//Handlers
//Route handler
const createUserHandler = createFactory(User);
const getUserHandler = getAllFactory(User);
const getUserByIdHandler = getElementByIdFactory(User);
const updateUserById = updateElementByIdFactory(User);
const deleteUserById = deleteElementByIdFactory(User);

module.exports = {
  getUserHandler,
  createUserHandler,
  getUserByIdHandler,
  updateUserById,
  deleteUserById,
  checkInput,
};

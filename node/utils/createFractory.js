const getAllFactory = (elementModel) => async (req, res) => {
  try {
    const data = await elementModel.find();
    if (data.length == 0) {
      throw new Error("No data found");
    }
    res.status(200).json({
      message: "Data Found",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

const createFactory = (elementModel) => async (req, res) => {
  try {
    const elementDetails = req.body;
    const data = await elementModel.create(elementDetails);
    res.status(200).json({
      status: 200,
      message: "Created successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

const getElementByIdFactory = (elementModel) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await elementModel.findById(id);
    if (data == undefined) {
      throw { message: "no data found", statusCode: 501 };
    }
    res.status(200).json({
      message: "data found sucessfully",
      data: data,
    });
  } catch (error) {
    // res.status(500).json({
    //   status: 500,
    //   error: error.message,
    // });
    next(error);
  }
};

function checkInput(req, res, next) {
  const userDetails = req.body;
  const isEmpty = Object.keys(userDetails).length === 0;
  if (isEmpty) {
    res.status(400).json({
      status: 400,
      message: "Body can not be empty",
    });
  } else {
    next();
  }
}

const deleteElementByIdFactory = (elementModel) => async (req, res) => {
  try {
    const { id } = req.params;
    const data = await elementModel.findByIdAndDelete(id);
    if (!data) {
      throw new Error("Data not found");
    }
    res.status(200).json({
      message: "Data deleted Sucessfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

const updateElementByIdFactory = (elementModel) => async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedData = await elementModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedData) {
      throw new Error("Unable to update data");
    }
    res.status(200).json({
      message: "Data updated sucessfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getAllFactory,
  createFactory,
  getElementByIdFactory,
  deleteElementByIdFactory,
  updateElementByIdFactory,
  deleteElementByIdFactory,
  checkInput,
};

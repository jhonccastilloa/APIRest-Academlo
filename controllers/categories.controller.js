const Category = require('../models/category.models');
const Product = require('../models/product.models');
const catchAsync = require('../utils/catchAsync');

const findCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes:{exclude:['createdAt','updateAt']},
      where: {
        status: true,
      },
      include:[
        {model:Product}
      ]
    });
    res.json({
      status: 'success',
      message: 'ROUTE - GET CONTROLLER',
      categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};
const findCategory = async (req, res) => {
  try {
    const { category } = req;
    res.json({
      status: 'success',
      message: 'ROUTE BY ID - GET CONTROLLER',
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

const updateCategory = catchAsync(async (req, res) => {
  const { category } = req;
  const { names } = req.body;
  const updateCategory = await category.update({
    name,
  });
  res.json({
    status: 'success',
    message: 'The Category has been updated successfully',
    updateCategory,
  });
});
const deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  await category.update({ status: false });
  res.json({
    status: 'success',
    message: 'Category was deleted successfully',
  });
});
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json({
      status: 'success',
      message: 'The category was created succesfully',
      newCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

module.exports = {
  createCategory,
  findCategories,
  findCategory,
  updateCategory,
  deleteCategory,
};

const Category = require("../models/category.models");

const validCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!category)
      return res
        .status(404)
        .json({ error: true, message: 'Category not found' });
    req.category=category
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};
module.exports = { validCategoryById };

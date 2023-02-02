const Product = require("../models/product.models");

const validProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!product)
      return res
        .status(404)
        .json({ error: true, message: 'Product not found' });
    req.product=product
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

module.exports = { validProductById };

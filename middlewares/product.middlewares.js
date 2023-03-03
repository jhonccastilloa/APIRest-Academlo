const Product = require('../models/product.models');
const ProductImg = require('../models/productImg');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const validProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
        status: true,
      },
      include: [
        {
          model: ProductImg,
        },
      ],
    });
    console.log({product})
    console.log("gasd")
    if (!product)
      return res
        .status(404)
        .json({ error: true, message: 'Product not found' });
    req.product = product;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

const validBodyProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  req.product = product;

  next();
});

const validIfExistProductnStock = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { quantity } = req.body;

  if (product.quantity < quantity) {
    return next(
      new AppError('There are not enaugh products in the stock', 400)
    );
  }

  next();
});
const validExistProductInStockForUpdate = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { newQty } = req.body;

  if (newQty > product.quantity) {
    return next(
      new AppError('There are not enaugh products in the stock', 400)
    );
  }

  next();
});

const validExistProductIdByParams = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  next();
});
module.exports = {
  validProductById,
  validBodyProductById,
  validIfExistProductnStock,
  validExistProductInStockForUpdate,
  validExistProductIdByParams,
};

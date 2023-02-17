const Cart = require('../models/cart.models');
const ProductInCart = require('../models/productInCart.models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const validExistCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  console.log(sessionUser.id)
  let cart = await Cart.findOne({
    where: {
      userdId: sessionUser.id,
      status: 'active',
    },
  });

  console.log({cart})
  if (!cart) {
    cart = await Cart.create({ userdId: sessionUser.id });
  }
  req.cart = cart;

  next();
});
const validExistProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;
  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId: product.id,
    },
  });
  if (productInCart && productInCart.status == 'remove') {
    await productInCart.update({ status: 'active' });
    return res.json({
      status: 'success',
      message: 'Product succesfully added',
    });
  }
  if (productInCart) {
    return next(new AppError('his product already exist in the cart', 400));
  }
  req.productInCart = productInCart;
  next();
});

const validExistProductInCartForUpdate = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId } = req.body;

  const cart = await Cart.findOne({
    where: {
      userdId: sessionUser.id,
      status: 'active',
    },
  });
  console.log({cart})

  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (!productInCart) {
    return next(new AppError('The product does not exist in the cart', 400));
  }

  req.productInCart = productInCart;

  next();
});

const validExistProductInCartByParamsForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const cart = await Cart.findOne({
      where: {
        userdId: sessionUser.id,
        status: 'active',
      },
    });

    const productInCart = await ProductInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
        status: 'active',
      },
    });

    if (!productInCart) {
      return next(new AppError('The product does not exist in the cart', 400));
    }

    req.productInCart = productInCart;

    next();
  }
);
module.exports = {
  validExistCart,
  validExistProductInCart,
  validExistProductInCartForUpdate,
  validExistProductInCartByParamsForUpdate,
};

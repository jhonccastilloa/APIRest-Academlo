const Cart = require('../models/cart.models');
const Order = require('../models/order.model');
const Product = require('../models/product.models');
const ProductInCart = require('../models/productInCart.models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const productInCart = await ProductInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  res.json({
    status: 'success',
    message: 'The product has been added',
    productInCart,
  });
});
const updateCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { productInCart } = req;
  if (newQty < 0) {
    return next(new AppError('The quantity must be greater than 0', 400));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: newQty, status: 'removed' });
  } else {
    await productInCart.update({ quantity: newQty, status: 'active' });
  }

  res.status(200).json({
    status: 'success',
    message: 'The product in cart has been updated',
  });
});

const removeProductToCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;

  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(200).json({
    status: 'success',
    message: 'The product in cart has been removed',
  });
});

const buyProductOnCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const cart = await Cart.findOne({
    where: {
      userdId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: ProductInCart,
        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
        where: {
          status: 'active',
        },
        include: [
          {
            model: Product,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
    ],
  });
  if (!cart) {
    return next(new AppError('There are not products in cart', 404));
  }
  //2. calcular el precio total a pagar
  let totalPrice = 0;

  cart.productInCarts.forEach(productInCart => {
    totalPrice += productInCart.quantity * productInCart.product.price;
  });

  //3. vamos a actualizar el stock o cantidad del modelo Product
  const purchasedProductPromises = cart.productInCarts.map(
    async productInCart => {
      const product = await Product.findOne({
        where: {
          id: productInCart.productId,
        },
      });

      const newStock = product.quantity - productInCart.quantity;

      return await product.update({ quantity: newStock });
    }
  );

  const statusProductInCartPromises = cart.productInCarts.map(
    async productInCart => {
      const foundProductInCart = await ProductInCart.findOne({
        where: {
          productId: productInCart.productId,
          status: 'active',
        },
      });
      return await foundProductInCart.update({ status: 'purchased' });
    }
  );
  await Promise.all(purchasedProductPromises);
  await Promise.all(statusProductInCartPromises);

  await cart.update({ status: 'purchased' });

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });
  res.json({
    message:"",
    cart,
    order
  });
});

module.exports = {
  addProductToCart,
  updateCart,
  removeProductToCart,
  buyProductOnCart,
};

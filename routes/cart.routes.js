const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProductToCart,
  updateCart,
  removeProductToCart,
  buyProductOnCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middlewares');
const {
  validExistCart,
  validExistProductInCart,
  validExistProductInCartForUpdate,
  validExistProductInCartByParamsForUpdate,
} = require('../middlewares/cart.middlewares');
const {
  validBodyProductById,
  validIfExistProductnStock,
  validExistProductInStockForUpdate,
  validExistProductIdByParams,
} = require('../middlewares/product.middlewares');
const validateField = require('../middlewares/validateField.middleware');

const router = Router();
router.use(protect);
router.post(
  '/add-product',
  [
    check('productId', 'the productId is required').notEmpty().isNumeric(),
    check('quantity', 'the quantity is required').notEmpty().isNumeric(),
    validateField,
    validBodyProductById,
    validIfExistProductnStock,
    validExistCart,
    validExistProductInCart,
  ],
  addProductToCart
);

router.patch(
  '/update-cart',
  [
    check('productId', 'The producId is required').not().isEmpty(),
    check('productId', 'The producId must be a number').isNumeric(),
    check('newQty', 'The quantity is required').not().isEmpty(),
    check('newQty', 'The quantity must be a number').isNumeric(),
    validateField,
    validBodyProductById,
    validExistProductInStockForUpdate,
    validExistProductInCartForUpdate,
  ],
  updateCart
);
router.delete(
  '/:productId',
  validExistProductIdByParams,
  validExistProductInCartByParamsForUpdate,
  removeProductToCart
);
router.post('/purchase',buyProductOnCart)
module.exports = {
  cartRouter: router,
};

const { Router } = require('express');
const {
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  findProducts,
} = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middlewares');
const { validProductById } = require('../middlewares/product.middlewares');

const router = Router();

router.get('/:id', findProduct);
router.get('/', findProducts);
router.use(protect)

router.post('/', createProduct);
router.patch('/:id', updateProduct);

router.delete('/:id',validProductById, deleteProduct);

module.exports = {
  productRouter: router,
};

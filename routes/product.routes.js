const { Router } = require('express');
const {
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const router = Router();

router.get('/', findProduct);

router.post('/', createProduct);
router.put('/', updateProduct);
router.patch('/', (req, res) => {
  res.json({ status: 'success', message: 'ROUTE - PATCH' });
});
router.delete('/', deleteProduct);

module.exports = {
  productRouter: router,
};

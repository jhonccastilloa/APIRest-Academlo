const { Router } = require('express');
const {
  createCategory,
  findCategories,
  findCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');
const { protect, restrictTo } = require('../middlewares/auth.middlewares');
const { validCategoryById } = require('../middlewares/category.middlewares');

const router = Router();

router.get('/', findCategories);
router.get('/:id', validCategoryById, findCategory);

router.use(protect)
router.post('/',protect, restrictTo('admin'),createCategory);
router.patch('/:id', validCategoryById, updateCategory);
router.delete('/:id', validCategoryById, deleteCategory);

module.exports = {
  categoryRouter: router,
};

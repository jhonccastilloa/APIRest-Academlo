const Product = require('../models/product.models');
const ProductImg = require('../models/productImg');
const { ref, uploadBytes } = require('firebase/storage');
const { storage } = require('../utils/firebase');

const findProducts = async (req, res) => {
  const products = await Product.findAll({
    where: {
      status: true,
    },
  });

  res.json({ status: 'success', message: 'ROUTE - GET CONTROLLER', products });
};
const findProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: {
      id,
      status: true,
    },
  });
  if (!product)
    return res.status(404).json({ error: true, message: 'Product not found' });
  res.json({
    status: 'success',
    message: 'ROUTE BY ID - GET CONTROLLER',
    product,
  });
};

const createProduct = async (req, res) => {
  const { title, description, quantity, price, categoryId, userId } = req.body;

  console.log(req.files);
  const newProduct = await Product.create({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
    categoryId,
    userId,
  });

  const productImgsPromises = req.files.map(async file => {
    const imgRef = ref(storage, `products/${Date.now()}-${file.originalname}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);
    return await ProductImg.create({
      imgUrl: imgUploaded.metadata.fullPath,
      productId: newProduct.id,
    });
  });
  await Promise.all(productImgsPromises);
  res.status(201).json({
    status: 'success',
    message: 'The product was created succesfully',
    newProduct,
  });
};
const updateProduct = async (req, res) => {
  const { title, description, quantity, price } = req.body;
  const { product } = req;
  const updateProduct = await product.update({
    title,
    description,
    quantity,
    price,
  });
  res.json({
    status: 'success',
    message: 'The product has been updated successfully',
    updateProduct,
  });
};
const deleteProduct = async (req, res) => {
  const { product } = req;
  await product.update({ status: false });
  res.json({ status: 'success', message: 'User was deleted successfully' });
};

module.exports = {
  findProduct,
  findProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

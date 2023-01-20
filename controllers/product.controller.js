const findProduct = (req, res) => {
  console.log(req)
  res.json({ status: 'success', message: 'ROUTE - GET CONTROLLER' });
};

const createProduct=(req, res) => {
 
  res.json({ status: 'success', message: 'ROUTE - POST CONTROLLER' });
};
const updateProduct=(req, res) => {
  console.log(req)
  res.json({ status: 'success', message: 'ROUTE - UPDATE CONTROLLER' });
};
const deleteProduct=(req, res) => {
  console.log(req)
  res.json({ status: 'success', message: 'ROUTE - DELETE CONTROLLER' });
};

module.exports = {
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

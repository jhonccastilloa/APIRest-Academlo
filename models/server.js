const express = require('express');
const {productRouter} = require('../routes/product.routes');

//1. CREAMOS UNA CLASE

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.path={
      users:'/api/v1/users',
      products:'/api/v1/products'
    }
    this.middlewares()
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }
  routes() {
   this.app.use(this.path.products,productRouter)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is runing on port', this.port);
    });
  }
}

module.exports = Server;

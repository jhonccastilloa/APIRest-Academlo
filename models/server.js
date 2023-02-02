const express = require('express');
const { productRouter } = require('../routes/product.routes');
const cors = require('cors');
const db = require('../database/db');
const { userRouter } = require('../routes/user.routes');
const { categoryRouter } = require('../routes/categories.routes');
const morgan = require('morgan');
const globaErrorHandle = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const { authRouter } = require('../routes/auth.routes');
//1. CREAMOS UNA CLASE

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.path = {
      users: '/api/v1/users',
      products: '/api/v1/products',
      category: '/api/v1/categories',
      auth: '/api/v1/auth',
    };
    this.middlewares();
    this.routes();
    this.database();
  }

  middlewares() {
    // if (process.env.NODE_ENV === 'development') {
    //   this.app.use(morgan('dev'));
    // }
    if (process.env.NODE_ENV === 'development') {
      console.log('HOLA ESTOY EN DESARROLLO');
    }

    if (process.env.NODE_ENV === 'production') {
      console.log('HOLA ESTOY EN PRODUCCIÓN');
    }
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.path.products, productRouter);
    this.app.use(this.path.users, userRouter);
    this.app.use(this.path.category, categoryRouter);
    this.app.use(this.path.auth, authRouter);
   
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find  ${req.originalUrl} on this Server`, 404)
      );
    });

    this.app.use(globaErrorHandle);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticate'))
      .catch(err => console.log(err));
    db.sync()
      .then(() => console.log('Database synced'))
      .catch(err => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is runing on port', this.port);
    });
  }
}

module.exports = Server;

const express = require('express');
const { productRouter } = require('../routes/product.routes');
const cors = require('cors');
const db = require('../database/db');
const { userRouter } = require('../routes/user.routes');
const { categoryRouter } = require('../routes/categories.routes');
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const globaErrorHandle = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const { authRouter } = require('../routes/auth.routes');
const { default: helmet } = require('helmet');
const initModels = require('./initModels');
const { cartRouter } = require('../routes/cart.routes');

// const User = require('./user.model');
// const Product = require('./product.models');



//1. CREAMOS UNA CLASE

class Server {
  constructor() {
    this.app = express();
    this.limiter = rateLimit({
      max: 5,
      WindowMs: 60 * 60 * 1000,
      message: 'Too many request. from this IP',
    });
    this.port = process.env.PORT || 3000;
    this.path = {
      users: '/api/v1/users',
      products: '/api/v1/products',
      category: '/api/v1/categories',
      auth: '/api/v1/auth',
      cart: '/api/v1/cart',
    };
    this.middlewares();
    this.routes();
    this.database();
  }

  middlewares() {
    // if (process.env.NODE_ENV === 'development') {
    //   this.app.use(morgan('dev'));
    // }
    this.app.use(helmet());
    this.app.use(xss());
    if (process.env.NODE_ENV === 'development') {
      console.log('HOLA ESTOY EN DESARROLLO');
    }

    if (process.env.NODE_ENV === 'production') {
      console.log('HOLA ESTOY EN PRODUCCIÓN');
    }

    this.app.use('/api/v1', this.limiter);
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.path.products, productRouter);
    this.app.use(this.path.users, userRouter);
    this.app.use(this.path.category, categoryRouter);
    this.app.use(this.path.auth, authRouter);
    this.app.use(this.path.cart, cartRouter);

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

    initModels()
    db.sync({force:true})
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

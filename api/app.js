const express = require("express");
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser')
const errorMiddlewares = require('../system/middlewares/error.middlewares');
const app = express()
const fileUpload = require("express-fileupload");
const allowCors = require('../vercel')
// Routers
const authRoutes = require('./auth/auth.router')
const usersRoutes = require('./users/user.router')
const productRoutes = require('./products/products.router')
const eventRoutes = require('./events/events.router')
const tableRoutes = require('./tables/tables.router')
const contactRoutes = require('./contact/contact.router')
const orderRoutes = require('./orders/orders.router')
// /Routers

// Config

// app.use(cors({
//     credentials: true,
//     origin: process.env.CLIENT_URL,
//     methods: "GET,PUT,POST,DELETE",
// }));

app.use(function (req, res, next) {
  var origins = [
      process.env.CLIENT_URL,
      'http://www.example.com'
  ];

  for(var i = 0; i < origins.length; i++){
      var origin = origins[i];

      if(req.headers.origin.indexOf(origin) > -1){
          res.header('Access-Control-Allow-Origin', req.headers.origin);
      }
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(fileUpload())
// app.use('/uploads', express.static(path.join(__dirname,'../uploads')))
app.use(express.static(path.join(__dirname, 'public')));
// /Config

// Routers
app.use('/api/auth', authRoutes) // auth
app.use('/api/users', usersRoutes) // users
app.use('/api/product', productRoutes) // product
app.use('/api/events', eventRoutes) // event
app.use('/api/tables', tableRoutes) // table
app.use('/api/contact', contactRoutes) // table
app.use('/api/orders', orderRoutes) // table
// /Routers

// Middlewares
app.use(errorMiddlewares)
// /Middlewares
module.exports = app
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
// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//       )
//     next();
// });
app.use(cors({origin: 'http://localhost:5173'}));
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
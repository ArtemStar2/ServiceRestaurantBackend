const Router = require('express').Router;
const telegramControllers = require('./telegram.controller')
const router = new Router();
router.post('/order', telegramControllers.auth);
module.exports = router
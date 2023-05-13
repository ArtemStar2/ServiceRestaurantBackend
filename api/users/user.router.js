const Router = require('express').Router;
const userControllers = require('./user.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', authMiddleware, userControllers.getUsers);

module.exports = router
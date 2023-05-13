const Router = require('express').Router;
const ordersControllers = require('./orders.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', authMiddleware, ordersControllers.getAllOrders);
router.get('/:id', authMiddleware, ordersControllers.getOrdersOne);
router.post('/create', authMiddleware, ordersControllers.createOrder);
router.post('/update', authMiddleware, ordersControllers.upldateOrder);
router.post('/delete', authMiddleware, ordersControllers.deleteOrder);
router.post('/str', authMiddleware, ordersControllers.productString);
module.exports = router
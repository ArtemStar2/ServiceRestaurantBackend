const Router = require('express').Router;
const productsControllers = require('./products.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', productsControllers.getProducts);
router.get('/:id', productsControllers.getProductOne);
router.post('/create', authMiddleware, productsControllers.createProduct);
router.post('/update', authMiddleware, productsControllers.upldateProduct);
router.post('/delete', authMiddleware, productsControllers.deleteProduct);

module.exports = router
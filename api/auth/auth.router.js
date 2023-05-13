const Router = require('express').Router;
const authControllers = require('./auth.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.post('/', authControllers.auth);
router.post('/logout', authControllers.logout);
router.get('/refresh', authControllers.refresh);
router.post('/admin', authControllers.authAdmin);
router.post('/admin/create', authMiddleware, authControllers.createAdmin);
router.post('/admin/delete', authMiddleware, authControllers.deleteAccount);
module.exports = router
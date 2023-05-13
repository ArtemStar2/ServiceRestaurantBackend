const Router = require('express').Router;
const contactControllers = require('./contact.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', authMiddleware, contactControllers.getContact);
router.post('/create', authMiddleware, contactControllers.createContact);
router.post('/update', authMiddleware, contactControllers.upldateContact);

module.exports = router
const Router = require('express').Router;
const tablesControllers = require('./tables.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', authMiddleware, tablesControllers.getAllTable);
router.get('/:id', authMiddleware, tablesControllers.getTableOne);
router.post('/create', tablesControllers.createTable);
router.post('/update', authMiddleware, tablesControllers.upldateTable);
router.post('/delete', authMiddleware, tablesControllers.deleteTable);

module.exports = router
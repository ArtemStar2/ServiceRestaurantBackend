const Router = require('express').Router;
const eventsControllers = require('./events.controller')
const router = new Router();
const authMiddleware = require('../../system/middlewares/auth.middlewares')

router.get('/', authMiddleware, eventsControllers.getAllEvents);
router.get('/:id', authMiddleware, eventsControllers.getEventOne);
router.post('/create', authMiddleware, eventsControllers.createEvent);
router.post('/update', authMiddleware, eventsControllers.upldateEvent);
router.post('/delete', authMiddleware, eventsControllers.deleteEvent);

module.exports = router
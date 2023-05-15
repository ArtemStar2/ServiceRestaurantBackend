const eventService = require('./events.service')

class eventsControllers{
    async getAllEvents(req, res, next){
        try{
            const product = await eventService.getAllEvents()
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async getEventOne(req, res, next){
        try{
            const product = await eventService.getEventOne(req.params.id)
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async upldateEvent(req, res, next){
        try{
            const { id, name, date, description } = req.body
            const userData = await eventService.upldateEvent(id, name, date, description, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    
    async createEvent(req, res, next){
        try{
            const { name, description, date } = req.body
            const userData = await eventService.createEvent(name, date, description, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async deleteEvent(req, res, next){
        try{
            const { eventId } = req.body
            const userData = await eventService.deleteEvent(eventId, req.user.role) 
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new eventsControllers();
const ordersService = require('./orders.service')

class eventsControllers{
    async getAllOrders(req, res, next){
        try{
            const product = await ordersService.getAllOrders()
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async getOrdersOne(req, res, next){
        try{
            const product = await ordersService.getOrdersOne(req.params.id)
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async productString(req, res, next){
        try{
            const product = await ordersService.productString(req.body.str)
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async upldateOrder(req, res, next){
        try{
            const { id, userId, products, date} = req.body
            const userData = await ordersService.upldateOrder(id, userId, products, date, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    
    async createOrder(req, res, next){
        try{
            const { products, date} = req.body
            const userData = await ordersService.createOrder(req.user.id, products, date)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async deleteOrder(req, res, next){
        try{
            const { orderId } = req.body
            const userData = await ordersService.deleteOrder(orderId, req.user.role) 
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new eventsControllers();
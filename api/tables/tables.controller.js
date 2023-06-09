const tablesService = require('./tables.service')

class tablesControllers{
    async getAllTable(req, res, next){
        try{
            const product = await tablesService.getAllTables()
            return res.json(product);
        } catch(e){
            next(e)
        }
    }    
    async getTableOne(req, res, next){
        try{
            const product = await tablesService.getTableOne(req.params.id)
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async createTable(req, res, next){
        try{
            const { date, event, table_id } = req.body
            console.log(req.user);
            const userData = await tablesService.createTable(req.user?.id, date, event, table_id)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async deleteTable(req, res, next){
        try{
            const { tableId } = req.body
            const userData = await tablesService.deleteTable(tableId, req.user.id, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async upldateTable(req, res, next){
        try{
            const { id, date, event, table_id } = req.body
            const userData = await tablesService.upldateTable(id, date, event, table_id, req.user.id, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new tablesControllers();
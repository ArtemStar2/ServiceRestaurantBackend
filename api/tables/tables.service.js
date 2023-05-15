const db = require('../../system/scripts/database/index')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'tableStol';

class tableService{
    async getAllTables(){
        const tables = await db.getAll(tableBD);
        return tables;
    }
    async getTableOne(id){
        const table = await db.findByID(tableBD, id);
        return table;
    }

    async upldateTable(id, date, event, iduser, role){
        
        let candidate = await db.findByID(tableBD, id);
        if(role != "admin" && iduser != candidate.userId){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        var data = {};
        if(date){
            data.date = date;
        }
        if(event){
            data.event = event;
        }
        if(!await db.update(tableBD, data, id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        
        return { 
            success: true,
            massage: "Бронь изменена"
        }
    }

    async createTable(userId, date, event = ''){
        console.log(data);
        if(!userId){
            throw ApiError.BadRequest('Ошибка!')
        }
        if(!date){
            throw ApiError.BadRequest('Отсутствует дата брони')
        }

        var data = {userId: userId, date: date, event:event}  
        console.log(data);            
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        
        return { 
            success: true,
            massage: "Бронь добавлена"
        }
    }

    async deleteTable(bronId, iduser, role){
        
        let candidate = await db.findByID(tableBD, bronId);
        if(role != "admin" && iduser != candidate.userId){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!bronId){
            throw ApiError.BadRequest('Ошибка!')
        }
        const deletedRows = await db.delete(tableBD, bronId);
        if(!deletedRows){
            throw ApiError.BadRequest('Бронь не найдена')
        }
        
        return { 
            success: true,
            massage: "Бронь удалена"
        }
    }
}

module.exports = new tableService()
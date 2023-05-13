const db = require('../../system/scripts/database/index')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'tableStol';

function checkDateOverlap(start1, end1, start2, end2) {
    return (start1 < end1 && start2 < end2 && end1 <= start2) || (start1 > end1 && start2 > end2 && end2 <= start1);
}
class tableService{
    async getAllTables(){
        await db.connect();
        const tables = await db.getAll(tableBD);
        await db.disconnect();
        return tables;
    }
    async getTableOne(id){
        await db.connect();
        const table = await db.findByID(tableBD, id);
        await db.disconnect();
        return table;
    }

    async upldateTable(id, dateStart, dateEnd, table_id, iduser, role){
        await db.connect();
        let candidate = await db.findByID(tableBD, id);
        if(role != "admin" && iduser != candidate.userId){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        var data = {};
        if(dateStart){
            data.dateStart = dateStart;
        }
        if(dateEnd){
            data.dateEnd = dateEnd;
        }
        if(table_id){
            data.table_id = table_id;
        }
        if(!await db.update(tableBD, data, id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Бронь изменена"
        }
    }

    async createTable(userId, dateStart, dateEnd, table_id){
        if(!userId){
            throw ApiError.BadRequest('Ошибка!')
        }
        if(!dateStart){
            throw ApiError.BadRequest('Отсутствует дата начала брони')
        }
        if(!dateEnd){
            throw ApiError.BadRequest('Отсутствует дата конца брони')
        }
        if(!table_id){
            throw ApiError.BadRequest('Отсутствует номер стола')
        }
        await db.connect();
        const tables = await db.getAll(tableBD);
        tables.forEach(element => {
            if(!checkDateOverlap(new Date(element.dateStart), new Date(element.dateEnd), new Date(dateStart), new Date(dateEnd))){
                throw ApiError.BadRequest('На эту дату уже есть бронь')
            }
        });
        var data = {userId: userId, dateStart: dateStart, dateEnd:dateEnd, table_id: table_id}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Бронь добавлена"
        }
    }

    async deleteTable(bronId, iduser, role){
        await db.connect();
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
        await db.disconnect();
        return { 
            success: true,
            massage: "Бронь удалена"
        }
    }
}

module.exports = new tableService()
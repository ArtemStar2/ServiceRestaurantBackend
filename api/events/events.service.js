const db = require('../../system/scripts/database/index')
const FileService = require('../../system/files/files.controllers')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'event';
var fs = require('fs');
const path = require('path');

class eventsService{
    async getAllEvents(){
        
        const users = await db.getAll(tableBD);
        
        return users;
    }
    
    async getEventOne(id){
        
        const users = await db.findByID(tableBD, id);
        
        return users;
    }

    async upldateEvent(id, name, date, description, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        var data = {name: name, date: date, description: description};
        if(!await db.update(tableBD, data, id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        return { 
            success: true,
            massage: "Мeроприятие изменёно"
        }
    }
    

    async createEvent(name, date, description, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!name){
            throw ApiError.BadRequest('Название отсутствует')
        }
        if(!date){
            throw ApiError.BadRequest('Дата отсутствует')
        }
        let candidate = await db.findByValue(tableBD, 'date', date);
        if(candidate){
            throw ApiError.BadRequest('На эту дату уже есть Мароприятие')
        }
        var data = {name: name, date: date, description: description}             
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        
        return { 
            success: true,
            massage: "Мeроприятие добавлено"
        }
    }

    async deleteEvent(EventId, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!EventId){
            throw ApiError.BadRequest('Ошибка!')
        }
        
        const deletedRows = await db.delete(tableBD, EventId);
        if(!deletedRows){
            throw ApiError.BadRequest('Мароприятие не найден')
        }
        
        return { 
            success: true,
            massage: "Мeроприятие удалёно"
        }
    }
}

module.exports = new eventsService()
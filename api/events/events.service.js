const db = require('../../system/scripts/database/index')
const FileService = require('../../system/files/files.controllers')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'event';
var fs = require('fs');
const path = require('path');

class eventsService{
    async getAllEvents(){
        await db.connect();
        const users = await db.getAll(tableBD);
        await db.disconnect();
        return users;
    }
    
    async getEventOne(id){
        await db.connect();
        const users = await db.findByID(tableBD, id);
        await db.disconnect();
        return users;
    }

    async upldateEvent(id, name, date, images, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        
        await db.connect();
        let candidate = await db.findByID(tableBD, id);
        var data = {};
        if(name){
            data.name = name;
        }
        if(date){
            data.date = date;
        }
        if(images){
            if(candidate.images){
                fs.access(path.join(__dirname,'../../uploads/') + candidate.images, function(error){
                    if (error) {
                        console.log("Файл не найден");
                    } else {
                        fs.unlinkSync(path.join(__dirname,'../../uploads/') + candidate.images);
                    }
                });
                
            }
            const imageUrl = FileService.saveFile(images);
            data.images = imageUrl;
        }
        if(!await db.update(tableBD, data, candidate.id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Мароприятие изменёно"
        }
    }
    

    async createEvent(name, date, images, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!name){
            throw ApiError.BadRequest('Название отсутствует')
        }
        if(!images){
            throw ApiError.BadRequest('Картинка отсутствует')
        }
        await db.connect();
        let candidate = await db.findByValue(tableBD, 'date', date);
        if(candidate){
            throw ApiError.BadRequest('На эту дату уже есть Мароприятие')
        }
        const imageUrl = FileService.saveFile(images);
        if(!imageUrl){
            throw ApiError.BadRequest('Не удалось загрузить изображение')
        }
        var data = {name: name, date: date, images:imageUrl}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Мароприятие добавлено"
        }
    }

    async deleteEvent(EventId, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!EventId){
            throw ApiError.BadRequest('Ошибка!')
        }
        await db.connect();
        const deletedRows = await db.delete(tableBD, EventId);
        if(!deletedRows){
            throw ApiError.BadRequest('Мароприятие не найден')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Мароприятие удалёно"
        }
    }
}

module.exports = new eventsService()
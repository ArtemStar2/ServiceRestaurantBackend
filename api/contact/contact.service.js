const db = require('../../system/scripts/database/index')
const FileService = require('../../system/files/files.controllers')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'contacts';


class eventsService{
    async getContact(){
        await db.connect();
        const users = await db.getAll(tableBD);
        await db.disconnect();
        return users[0];
    }

    async upldateContact(id, phone, email, telegram, website, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        await db.connect();
        let candidate = await db.findByID(tableBD, id);
        var data = {phone: phone, email: email, telegram: telegram, website: website}  
        if(!await db.update(tableBD, data, candidate.id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Контакты изменены"
        }
    }
    
    async createContact(phone, email, telegram, website, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }

        await db.connect();
        var data = {phone: phone, email: email, telegram: telegram, website: website}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Контакты изменены"
        }
    }
}

module.exports = new eventsService()
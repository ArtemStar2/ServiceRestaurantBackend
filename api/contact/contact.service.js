const db = require('../../system/scripts/database/index')
const FileService = require('../../system/files/files.controllers')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'contacts';


class eventsService{
    async getContact(){
        
        const users = await db.getAll(tableBD);
        
        return users[0];
    }

    async upldateContact(id, phone, email, telegram, website, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        
        let candidate = await db.findByID(tableBD, id);
        var data = {phone: phone, email: email, telegram: telegram, website: website}  
        if(!await db.update(tableBD, data, candidate.id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        
        return { 
            success: true,
            massage: "Контакты изменены"
        }
    }
    
    async createContact(phone, email, telegram, website, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }

        
        var data = {phone: phone, email: email, telegram: telegram, website: website}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        
        return { 
            success: true,
            massage: "Контакты изменены"
        }
    }
}

module.exports = new eventsService()
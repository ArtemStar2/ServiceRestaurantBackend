const db = require('../../system/scripts/database/index')
const FileService = require('../../system/files/files.controllers')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'products';
var fs = require('fs');
const path = require('path');

class productsService{
    async getAllProduct(){
        
        const users = await db.getAll(tableBD);
        
        return users;
    }
    
    async getProductOne(id){
        
        const users = await db.findByID(tableBD, id);
        
        return users;
    }

    async upldateProduct(id, name, description, images, price, category, price_old, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        
        
        let candidate = await db.findByID(tableBD, id);
        var data = {};
        if(name){
            data.name = name;
        }
        if(description){
            data.description = description;
        }
        if(images && false){
            // console.log(candidate);
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
        if(price){
            data.price = price;
        }
        if(price_old){
            data.price_old = price_old;
            data.stock = true;
        }else{
            data.stock = false;
        }
        if(category){
            data.category = category;
        }
        console.log(data);
        if(!await db.update(tableBD, data, id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        
        return { 
            success: true,
            massage: "Товар изменён"
        }
    }
    

    async createProduct(name, description, images, price, category, price_old, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!name){
            throw ApiError.BadRequest('Название отсутствует')
        }
        if(!images && false){
            throw ApiError.BadRequest('Картинка отсутствует')
        }
        if(!price){
            throw ApiError.BadRequest('Цена отсутствует')
        }
        if(!category){
            throw ApiError.BadRequest('Не выбрана категория')
        }
        
        // let candidate = await db.findByValue(tableBD, 'name', name);
        // if(candidate){
        //     throw ApiError.BadRequest('Товар уже существует')
        // }
        var data = {name: name, description: description, price: price, category: category, price_old: price_old}
        if(price_old){
            data.stock = true;
        }else{
            data.stock = false;
        }
        if(images && false){
            const imageUrl = FileService.saveFile(images);
            if(!imageUrl){
                throw ApiError.BadRequest('Не удалось загрузить изображение')
            }
            data.images = imageUrl;
        }
                  
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        
        return { 
            success: true,
            massage: "Товар добавленный"
        }
    }

    async deleteProduct(productId, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!productId){
            throw ApiError.BadRequest('Ошибка!')
        }
        
        const deletedRows = await db.delete(tableBD, productId);
        if(!deletedRows){
            throw ApiError.BadRequest('Товар не найден')
        }
        
        return { 
            success: true,
            massage: "Товар удалён"
        }
    }
}

module.exports = new productsService()
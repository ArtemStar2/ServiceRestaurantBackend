const { v4: uuidv4 } = require('uuid');
const path = require('path');
const ApiError = require('../scripts/error/api.error')

class FileService {
    saveFile(file) {
        const type = file.name.split('.').pop()
        if(type != "png" && type != "jpg" && type != "jpeg" && type != "web"){
            throw ApiError.BadRequest('Формат не верный, надо png | jpg | jpeg | web');
        }
        try { 
            const fileName = uuidv4() + '.' + file.name.split('.').pop();
            const filePath = path.resolve('uploads', fileName);
            file.mv(filePath);
            return fileName;
        } catch (e) {
            throw ApiError.BadRequest('Ошибка')
        }
    }
}
module.exports = new FileService()
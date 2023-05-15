const db = require('../../system/scripts/database/index')
const tableBD = 'users';
const tokenService = require('../../system/service/token.service')
const authDto = require('./auth.dtos')
const ApiError = require('../../system/scripts/error/api.error')

class telegramService{
    async auth(login){
        
        let candidate = await db.findByTwoValues(tableBD, 'login', login, 'role', 'user');
        
        if(!candidate){  // Регистрация
            console.log(candidate);
            var data = {login: login, role: 'user'}              
            const userID = await db.insert(tableBD, data);
            console.log(userID.id);
            candidate = await db.findByID(tableBD, userID.id)
        }
        
        if(candidate.length > 0)
            candidate = candidate[0];

            console.log(candidate);
        const userdto = new authDto(candidate)
        if(userdto.role == "admin"){
            throw ApiError.BadRequest('Нельзя войти через этот аккаунт')
        }
        
        const tokens = tokenService.generateToken({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken)
        return { ...tokens, user: userdto }
    }
}

module.exports = new telegramService()
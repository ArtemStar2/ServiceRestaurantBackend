const bcrypt = require('bcrypt')
const db = require('../../system/scripts/database/index')
const tableBD = 'users';
const tokenService = require('../../system/service/token.service')
const authDto = require('./auth.dtos')
const ApiError = require('../../system/scripts/error/api.error')

class authService{
    async auth(login){

        // let candidate = await db.findByTwoValues(tableBD, 'login', login, 'role', 'user');
        let candidate = null;
        if(true){  // Регистрация
            var data = {login: login, role: 'user'}              
            const userID = await db.insert(tableBD, data);
            candidate = await db.findByID(tableBD, userID)
        }else{
            throw ApiError.BadRequest('Нельзя войти через этот аккаунт')
        }
        
        const userdto = new authDto(candidate)
        if(userdto.role == "admin"){
            throw ApiError.BadRequest('Нельзя войти через этот аккаунт')
        }
        
        const tokens = tokenService.generateToken({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken)
        
        return { ...tokens, user: userdto }
    }

    async authAdmin(login, password){

        let candidate = await db.findByTwoValues(tableBD, 'login', login, 'role', 'admin');
        if(candidate){ // Авторизация
            if(candidate.password){
                if(!password){
                    throw ApiError.BadRequest('Пароль отсутствует')
                }
                const isPassEquals = await bcrypt.compare(password, candidate.password)
                if(!isPassEquals){
                    throw ApiError.BadRequest('Пароль неверный')
                }
            }else{
                throw ApiError.BadRequest('Пользователь не администратор')
            }
        }else{
            if(!login){
                throw ApiError.BadRequest('Логин отсутствует')
            }
            if(!password){
                throw ApiError.BadRequest('Пароль отсутствует')
            }
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const userdto = new authDto(candidate)
        const tokens = tokenService.generateToken({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken)
        
        return { ...tokens, user: userdto }
    }

    async createAdmin(login, password,role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!password){
            throw ApiError.BadRequest('Пароль отсутствует')
        }

        let candidate = await db.findByTwoValues(tableBD, 'login', login, 'role', 'admin');
        if(candidate){
            throw ApiError.BadRequest('Пользователь уже существует')
        }
        const hashPassword = await bcrypt.hash(password, 3);
        var data = {login: login, password: hashPassword, role: 'admin'}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        
        return { 
            success: true,
            massage: "Пользователь создан"
        }
    }

    async deleteAccount(userId, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!userId){
            throw ApiError.BadRequest('Ошибка!')
        }

        const deletedRows = await db.delete(tableBD, userId);
        if(!deletedRows){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        
        return { 
            success: true,
            massage: "Пользователь удалён"
        }
    }

    async logout(refreshToken){

        const token = await tokenService.removeToken(refreshToken);
        
        return token;
    }

    async refresh(refreshToken){

        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken); 
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const userdto = new authDto(userData)
        const tokens = tokenService.generateToken({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken)
        
        return { ...tokens, user: userdto }
    }
}

module.exports = new authService()
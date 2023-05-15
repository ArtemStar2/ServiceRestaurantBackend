const authService = require('./telegram.service')

class telegramControllers{
    async auth(req, res, next){
        try{
            const { login } = req.body
            const userData = await authService.auth(login)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new telegramControllers();
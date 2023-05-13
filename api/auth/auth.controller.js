const authService = require('./auth.service')

class authControllers{
    async auth(req, res, next){
        res.set('Access-Control-Allow-Origin', '*');
        try{
            const { login } = req.body
            const userData = await authService.auth(login)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async authAdmin(req, res, next){
        try{
            const { login, password } = req.body
            const userData = await authService.authAdmin(login, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async createAdmin(req, res, next){
        try{
            const { login, password } = req.body
            const userData = await authService.createAdmin(login, password, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async deleteAccount(req, res, next){
        try{
            const { userId } = req.body
            const userData = await authService.deleteAccount(userId, req.user.role) 
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }

    async logout(req, res, next){
        try{
            const { refreshToken } = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(token);
        } catch(e){
            next(e)
        }
    }
    async refresh(req, res, next){
        try{
            const { refreshToken } = req.cookies;
            const userData = await authService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new authControllers();
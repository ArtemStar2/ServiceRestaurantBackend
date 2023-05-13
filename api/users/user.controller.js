const userService = require('./user.service')

class userControllers{
    async getUsers(req, res, next){
        try{
            const users = await userService.getAllUsers()
            return res.json(users);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new userControllers();
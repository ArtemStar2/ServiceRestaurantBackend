const db = require('../../system/scripts/database/index')
const tableBD = 'users';

class userService{
    async getAllUsers(){
        
        const users = await db.getAll(tableBD);
        
        return users;
    }
}

module.exports = new userService()
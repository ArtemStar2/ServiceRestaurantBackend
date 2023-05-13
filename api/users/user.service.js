const db = require('../../system/scripts/database/index')
const tableBD = 'users';

class userService{
    async getAllUsers(){
        await db.connect();
        const users = await db.getAll(tableBD);
        await db.disconnect();
        return users;
    }
}

module.exports = new userService()
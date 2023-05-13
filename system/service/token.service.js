const jwt = require('jsonwebtoken')
const db = require('../scripts/database/index')
const tableToken = 'tokens';

class TokenService{
    generateToken(playload){
        const accessToken = jwt.sign(playload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(playload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e){
            return null;
        }
    }

    async saveToken(userID, refreshToken){
        const tokenData = await db.findByValue(tableToken, 'userID', userID);
        
        if(tokenData){
            const newData = { userID: userID, refreshToken: refreshToken };
            console.log(tokenData);
            const affectedRows = await db.update(tableToken, newData, tokenData.id);
            return affectedRows;
        } 
        const dataToken = { userID: userID, refreshToken: refreshToken};
        console.log(dataToken);
        const token = await db.insert(tableToken, dataToken);
        return token;
    }
    async removeToken(refreshToken){
        const refToken = await db.findByValue(tableToken, 'refreshToken', refreshToken);
        if(await db.delete(tableToken, refToken.ID)){
            return refToken;
        }
        return null;
    }

    async findToken(refreshToken){
        const refToken = await db.findByValue(tableToken, 'refreshToken', refreshToken);
        return refToken;
    }
}

module.exports = new TokenService()
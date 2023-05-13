const ApiError = require('../scripts/error/api.error')

module.exports = function(err, req, res, next){
    console.log(err)
    if(err instanceof ApiError){
        return res.status(err.status).json({ massage: err.massage, error: err.errors})
    }
    return res.status(500).json({ massage: err})
}
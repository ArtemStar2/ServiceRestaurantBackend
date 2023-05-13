module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, massage, errors = []){
        super(massage);
        this.massage = massage;
        this.status = status;
        this.errors = errors;
    }
    static UnauthorizedError(){
        return new ApiError(401, 'User not authorized')
    }
    static BadRequest(massage, errors = []){
        return new ApiError(400, massage, errors)
    }
}
module.exports = class authDto{
    login;
    id;
    role;
    constructor(model){
        this.login = model.login;
        this.id = model.id;
        this.role = model.role;
    }
}
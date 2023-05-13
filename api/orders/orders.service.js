const db = require('../../system/scripts/database/index')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'orders';

function convertStringToArray(inputString) {
    const array = inputString.split(',');
    const result = array.map((item) => parseInt(item.trim()));
    return result;
}

class ordersService{
    async getAllOrders(){
        await db.connect();
        const order = await db.getAll(tableBD);
        await db.disconnect();
        return order;
    }
    async productString(string){
        await db.connect();
        const arr = convertStringToArray(string);
        const productOne = [];
        let cost = 0;
        for (const item of arr) {
            var buff = {};
            const product = await db.findByID('products', item);
            if(!product){
                buff.id = 0;
                buff.name = "Товар не найден";
                buff.price = 0;
            }else{
                buff.id = product.id;
                buff.name = product.name;
                buff.price = product.price;
            }
            
            cost += parseInt(product?.price);
            productOne.push(buff)
        }
        await db.disconnect();
        return {
            productOne,
            cost
        };
    }
    async getOrdersOne(id){
        await db.connect();
        const users = await db.findByID(tableBD, id);
        await db.disconnect();
        return users;
    }

    async upldateOrder(id, userId, products, date, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        await db.connect();
        let candidate = await db.findByID(tableBD, id);
        var data = {};
        if(userId){
            data.userId = userId;
        }
        if(products){
            data.products = products;
        }
        if(date){
            data.date = date;
        }
        if(!await db.update(tableBD, data, candidate.id)){
            throw ApiError.BadRequest('Ошибка при изменении')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Заказ изменён"
        }
    }
    

    async createOrder(userId, products, date){
        if(!userId){
            throw ApiError.BadRequest('Пользователь отсутствует')
        }
        if(!products){
            throw ApiError.BadRequest('Товары отсутствуют')
        }
        await db.connect();

        var data = {userId: userId, products: products, date:date}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Заказ добавленый"
        }
    }

    async deleteOrder(orderId, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        if(!orderId){
            throw ApiError.BadRequest('Ошибка!')
        }
        await db.connect();
        const deletedRows = await db.delete(tableBD, orderId);
        if(!deletedRows){
            throw ApiError.BadRequest('Заказ не найден')
        }
        await db.disconnect();
        return { 
            success: true,
            massage: "Заказ удалён удалёно"
        }
    }
}

module.exports = new ordersService()
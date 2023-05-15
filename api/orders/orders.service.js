const db = require('../../system/scripts/database/index')
const ApiError = require('../../system/scripts/error/api.error')
const tableBD = 'orders';


class ordersService{
    async getAllOrders(){
        
        const order = await db.getAll(tableBD);
        
        return order;
    }
    async productString(string){
        
        const arr = JSON.parse(string);
        const productOne = [];
        let cost = 0;
        console.log('asdasdasdas');
        for (const item of arr) {
            var buff = {};
            const product = await db.findByID('products', item.id);
            console.log(product[0]);
            if(product.length == 0){
                buff.id = 0;
                buff.name = "Товар не найден";
                buff.price = 0;
                buff.count = 0;
            }else{
                buff.id = product[0].id;
                buff.name = product[0].name;
                buff.price = product[0].price;
                buff.count = item.count;
            }
            cost += parseInt(product[0]?.price) * item?.count;
            productOne.push(buff)
        }
        console.log(productOne);
        return {
            productOne,
            cost
        };
    }
    async getOrdersOne(id){
        
        const users = await db.findByID(tableBD, id);
        
        return users;
    }

    async upldateOrder(id, userId, products, date, role){
        if(role != "admin"){
            throw ApiError.BadRequest('Доступ только администраторам')
        }
        
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
        
        return { 
            success: true,
            massage: "Заказ изменён"
        }
    }
    

    async createOrder(userId, products){
        if(!userId){
            throw ApiError.BadRequest('Пользователь отсутствует')
        }
        if(!products){
            throw ApiError.BadRequest('Товары отсутствуют')
        }
        
        var data = {userId: userId, products: products, date: new Date()}              
        if(!await db.insert(tableBD, data)){
            throw ApiError.BadRequest('Ошибка при создании')
        }
        
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
        
        const deletedRows = await db.delete(tableBD, orderId);
        if(!deletedRows){
            throw ApiError.BadRequest('Заказ не найден')
        }
        
        return { 
            success: true,
            massage: "Заказ удалён удалёно"
        }
    }
}

module.exports = new ordersService()
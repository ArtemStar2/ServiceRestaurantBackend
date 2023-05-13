const productService = require('./products.service')

class productsControllers{
    async getProducts(req, res, next){
        try{
            const product = await productService.getAllProduct()
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async getProductOne(req, res, next){
        try{
            const product = await productService.getProductOne(req.params.id)
            return res.json(product);
        } catch(e){
            next(e)
        }
    }
    async upldateProduct(req, res, next){
        try{
            const { id, name, description, price, category } = req.body
            const userData = await productService.upldateProduct(id, name, description, req.files?.images, price, category, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    
    async createProduct(req, res, next){
        try{
            const { name, description, price, category } = req.body
            const userData = await productService.createProduct(name, description, req.files?.images, price, category, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    async deleteProduct(req, res, next){
        try{
            const { productId } = req.body
            const userData = await productService.deleteProduct(productId, req.user.role) 
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new productsControllers();
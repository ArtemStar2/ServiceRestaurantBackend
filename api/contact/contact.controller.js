const contactService = require('./contact.service')

class contactControllers{
    async getContact(req, res, next){
        try{
            const product = await contactService.getContact()
            return res.json(product);
        } catch(e){
            next(e)
        }
    }

    async upldateContact(req, res, next){
        try{
            const { id, phone, email, telegram, website } = req.body
            const userData = await contactService.upldateContact(id, phone, email, telegram, website, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
    
    async createContact(req, res, next){
        try{
            const { phone, email, telegram, website } = req.body
            const userData = await contactService.createContact(phone, email, telegram, website, req.user.role)
            return res.status(200).json(userData);
        } catch(e){
            next(e)
        }
    }
}

module.exports = new contactControllers();
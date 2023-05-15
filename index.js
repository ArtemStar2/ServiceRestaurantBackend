require('dotenv').config();

const app = require('./api/app');
const PORT = process.env.PORT || 8080

const TelegramApi = require('node-telegram-bot-api')
const token = '6190170133:AAEumUhRkTDn0MJ7hN4F8U2BPxemn1Q4WQI';
const bot = new TelegramApi(token, {polling: true})

const chat = {}
const webAppUrl = 'https://service-restaurant-admin-panel.vercel.app/';



const start = async () => {
    try{
        app.listen(PORT, () => {
            console.log(`Server has been started on ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}
start()
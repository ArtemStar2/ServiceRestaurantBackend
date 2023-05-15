require('dotenv').config();

const app = require('./api/app');
const PORT = process.env.PORT || 8080

const TelegramApi = require('node-telegram-bot-api')
const token = '6190170133:AAEumUhRkTDn0MJ7hN4F8U2BPxemn1Q4WQI';
const bot = new TelegramApi(token, {polling: true})

const chat = {}
const webAppUrl = 'https://service-restaurant-admin-panel.vercel.app/';

bot.setMyCommands([
    {command: "/start", description: "Запустить бота"},
    {command: "/menu", description: "Меню"},
    {command: "/events", description: "Мероприятие"},
    {command: "/waiter", description: "Позвать официанта"},
    {command: "/table", description: "Забронировать стол"},
    {command: "/contact", description: "Наши контакты"},
    {command: "/profile", description: "Профиль"}
])


bot.on('callback_query', msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data == 'menu'){
        console.log('Профиль')
    }
    console.log(msg);
})

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text == '/start'){
        return bot.sendMessage(chatId, `Вы запустили ресторан бота`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Меню', web_app:{url: webAppUrl + 'menu/'}}],
                    [{text: 'Мероприятие', web_app:{url: webAppUrl + 'events/'}}],
                    [{text: 'Позвать официанта', callback_data: 'waiter'}],
                    [{text: 'Забронировать стол', callback_data: 'table'}],
                    [{text: 'Наши контакты', callback_data: 'contact'}],
                    [{text: 'Профиль', callback_data: 'profile'}],
                ]
            }
        })
    }
    if(text == "/menu"){
        return bot.sendMessage(chatId, `Меню`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Меню', web_app:{url: webAppUrl}}],
                ]
            }
        })
    }
    return bot.sendMessage(chatId, `Неверная команда`)
})


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
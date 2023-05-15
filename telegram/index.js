const TelegramApi = require('node-telegram-bot-api')
const token = '6190170133:AAEumUhRkTDn0MJ7hN4F8U2BPxemn1Q4WQI';
const bot = new TelegramApi(token, {polling: true})

const webAppUrl = 'https://service-restaurant-admin-panel.vercel.app/';

bot.setMyCommands([
    {command: "/start", description: "Запустить бота"},
])

bot.on('callback_query', msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data == 'menu'){
        console.log('menu')
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
                    [{text: 'Мероприятие', web_app:{url: webAppUrl + 'event/'}}],
                    [{text: 'Позвать официанта', callback_data: 'waiter'}],
                    [{text: 'Забронировать стол', web_app:{url: webAppUrl + 'table/'}}],
                    [{text: 'Наши контакты', callback_data: 'contact'}],
                    [{text: 'Профиль', callback_data: 'profile'}],
                ]
            }
        })
    }
    return bot.sendMessage(chatId, `Неверная команда`)
})
module.exports = bot;
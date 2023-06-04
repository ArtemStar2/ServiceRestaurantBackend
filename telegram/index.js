const TelegramApi = require('node-telegram-bot-api')
const token = '6190170133:AAEumUhRkTDn0MJ7hN4F8U2BPxemn1Q4WQI';
const bot = new TelegramApi(token, {polling: true})
const contactService = require('../api/contact/contact.service')
const webAppUrl = 'https://service-restaurant-admin-panel.vercel.app/';

bot.setMyCommands([
    {command: "/start", description: "Запустить бота"},
])

bot.on('callback_query',async msg =>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data == 'contact'){
        const product = await contactService.getContact();
        return bot.sendMessage(chatId, `Наши контакты:\nТелефон: ${product["phone"]}\nEmail: ${product["email"]}\nTelegram: ${product["telegram"]}\nWebsite: ${product["website"]}\n`)
    }else if(data == 'waiter'){
        return bot.sendMessage(chatId, `Что вас интересует?`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Консультация', callback_data: 'consultation'}],
                    [{text: 'Принести меню', callback_data: 'menu'}],
                    [{text: 'Счёт', callback_data: 'check'}],
                ]
            }
        })
    }else if(data == 'consultation' || data == 'menu' || data == 'check'){
        switch (data) {
            case 'consultation':
                console.log('Консультация');
                break;
            case 'menu':
                console.log('Принести меню');
                break;
            case 'check':
                console.log('Счёт');
                break;
            default:
                break;
        }
    }
})

bot.on('message', async msg => {
    console.log(msg);
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
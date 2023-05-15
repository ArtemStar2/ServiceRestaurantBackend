require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api')
const app = require('./api/app');
const PORT = process.env.PORT || 8080


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


const startBot = () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
    
        if(text === '/start') {
            await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
                reply_markup: {
                    keyboard: [
                        [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/menu'}}]
                    ]
                }
            })
    
            await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                    ]
                }
            })
        }
    
        if(msg?.web_app_data?.data) {
            try {
                const data = JSON.parse(msg?.web_app_data?.data)
                console.log(data)
                await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
                await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
                await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);
    
                setTimeout(async () => {
                    await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
                }, 3000)
            } catch (e) {
                console.log(e);
            }
        }
    });
}

startBot()


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
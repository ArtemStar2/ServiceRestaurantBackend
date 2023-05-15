const webAppUrl = 'http://localhost:5173/menu/';
module.exports = {
    chatOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Меню', callback_data: 'menu', web_app:{url: webAppUrl}}],
                [{text: 'Мероприятие', callback_data: 'events'}],
                [{text: 'Позвать официанта', callback_data: 'waiter'}],
                [{text: 'Забронировать стол', callback_data: 'table'}],
                [{text: 'Наши контакты', callback_data: 'contact'}],
                [{text: 'Профиль', callback_data: 'profile'}],
            ]
        })
    },
    menuOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Акционные приложения', web_app:{url: webAppUrl}}],
            ]
        })
    }
}
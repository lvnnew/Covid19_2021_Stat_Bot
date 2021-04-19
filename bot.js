require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKKEN);
bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу.
Введи название страны в формате "It" или "Italy"
посмотреть список всех стран /help
`,
    Markup.keyboard([
        ['Ukraine', 'Belarus'],
        ['Kazakhstan', 'Russia'],
    ])
    .resize()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text)

        const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
    `;
        ctx.reply(formatData);
    } catch {
        ctx.reply('Ошибка, такой страны не существует, посмотрите /help');
    }
});

bot.launch();
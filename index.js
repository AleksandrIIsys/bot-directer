require("dotenv").config();
const getImagesAdministration = require('./src/administration/GetImagesAdministration');
const getScheduleTeacher = require('./src/schedule/GetScheduleTeacher');
const getNews = require('./src/news/GetNews');
const commands = require("./src/utils/commands");
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const Path = require("path");
const spam_channel = process.env.SPAM_CHANNEL
console.log(spam_channel);
const fs = require('fs');
const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = bot.telegram
bot.use(session());
bot.start(async (ctx) => {
    let str = "Привет, " + ctx.chat.first_name;
    if (ctx.chat.last_name != null)
        str += " " + ctx.chat.last_name;
    return ctx.reply(str + "Этот бот предназначен для получения основной информации о колледже.");
});
bot.command("administration",async (ctx) => {
    const images = await getImagesAdministration();
    for (image of images) {
        await ctx.replyWithPhoto(image);
    }
})
bot.command('address',(ctx)=>{
    ctx.reply("Выберите интересующий вас корпус",Markup.keyboard([
        Markup.button.webApp("Учебный корпусу на ул. Казинца, 91","https://yandex.by/maps/157/minsk/?from=api-maps&ll=27.506591%2C53.848121&mode=usermaps&origin=jsapi_2_1_79&um=constructor%3AguzFU4s22sqVaXtqdHUaJMEWQzylyG_3&z=15"),
        Markup.button.webApp("Учебный корпусу на ул. Кнорина, 14","https://yandex.by/maps/157/minsk/?from=api-maps&ll=27.609303%2C53.929871&mode=usermaps&origin=jsapi_2_1_79&um=constructor%3AiP4zkcIXVBpU5O6mNyPei4WOPaDNVhHU&z=16"),
        ]).resize())
})
bot.command('schedule', async (ctx)=>{
    try {
        await getScheduleTeacher();
        await ctx.replyWithPhoto({source: fs.createReadStream('./src/assets/part1.png')});
        await ctx.replyWithPhoto({source: fs.createReadStream('./src/assets/part2.png')});
    }catch (e){
        console.log(e);
    }
})
bot.telegram.setMyCommands(commands);
bot.command('news', async (ctx)=>{
    try {
        const news = await getNews(true);
        for (_news of news) {
            if(_news) {
                await ctx.replyWithPhoto(_news.image, {caption: `${_news.title}\n\nПодробнее здесь ${_news.url}`})
            }
        }
        if(news.length === 0){
            await ctx.reply("За последний день нет новостей")

        }

    }catch (e) {
        console.log(e);
    }
})
bot.command('news_all', async (ctx)=>{
    try {
        const news = await getNews();
        for (_news of news) {
            if(_news) {
                await ctx.replyWithPhoto(_news.image, {caption: `${_news.title}\n\nПодробнее здесь ${_news.url}`})
            }
        }
    }catch (e) {
        console.log(e);
    }
})
bot.help((ctx) => {
    return ctx.reply("help");
});

bot.launch();
setInterval(async function newsInterval(){
    if(new Date().getHours() === 12){
    try {
        const news = await getNews(true);
        for (const _news of news) {
            await telegram.sendPhoto(spam_channel,_news.image, {caption :`${_news.title}\n\nПодробнее здесь ${_news.url}`});
        }
    }catch (e){
        console.log(e);
        await newsInterval();
    }
    }
},1000 * 60 * 60)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

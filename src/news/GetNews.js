const puppeter = require('puppeteer');
async function GetNews(date = false){
    const browser = await puppeter.launch();
    const page = await browser.newPage();
    await page.goto('http://mgke.minsk.edu.by/ru/main.aspx?guid=1031');
    const news = await page.evaluate(() => {
        const news_img = Object.entries(document.querySelectorAll('.MapBody > div img'));
        const news_title = Object.entries(document.querySelectorAll('.MapBody > div b'));
        const news_url = Object.entries(document.querySelectorAll('.MapBody > div a'));
        const news_date = Object.entries(document.querySelectorAll('.MapBody > div span'));
        let len = news_img.length;
        console.log(news_title);
        console.log(news_url);
        console.log(news_date);
        let resualt = []
        for(let i = 0;i < len;i++){
            resualt.push({
                image : news_img.map(([key, obj]) => {
                    return obj.src;
                })[i],
                title : news_title.map(([key, obj]) => {
                    return obj.innerText;
                })[i],
                url : news_url.map(([key, obj]) => {
                    return obj.href;
                })[i*2+1],
                date : news_date.map(([key, obj]) => {
                    return obj.innerText;
                })[i],
            })
        }
         return  resualt;
    })
    if(date){
        const _date = Date.now();
        return news.filter((obj)=>{
            const newDate = obj.date.split('.')
            console.log(_date - new Date(`${newDate[2]}-${newDate[1]}-${newDate[0]}`));
            return _date - new Date(`${newDate[2]}-${newDate[1]}-${newDate[0]}`) <= 1000*60*60*24 ? obj : undefined;
        })
    }
    await browser.close();
    return news;
}

module.exports =  GetNews;
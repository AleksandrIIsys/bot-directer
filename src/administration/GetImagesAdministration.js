const puppeter = require('puppeteer');
async function GetImagesAdministraion() {
    const browser = await puppeter.launch();
    const page = await browser.newPage();
    await page.goto('http://museum.mgke.minsk.edu.by/ru/main.aspx?guid=53971');

    const images = await page.evaluate(() => {
        const images = Object.entries(document.querySelectorAll('#admin'));
        return images.map(([key, obj]) => {
            return obj.src
        });
    })
    await browser.close();
    return images;
};
module.exports = GetImagesAdministraion;
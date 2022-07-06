const puppeter = require('puppeteer');
async function GetScheduleTeacher(){
    const browser = await puppeter.launch();
    const page = await browser.newPage();
    await page.goto('http://mgke.minsk.edu.by/ru/main.aspx?guid=3821');
    await page.waitForSelector('table');             // дожидаемся загрузки селектора
    const logo = await page.$('table');              // объявляем переменную с ElementHandle
    const box = await logo.boundingBox();              // данная функция возвращает массив геометрических параметров объекта в пикселях
    const x = box['x'];                                // координата x
    const y = box['y'];                                // координата y
    const w = box['width'];                            // ширина области
    const h = box['height'];                           // высота области
    await page.screenshot({'path': `src/assets/part1.png`, 'clip': {'x': x, 'y': y, 'width': w, 'height': h/2}});     // выполняем скриншот требуемой области и сохраняем его в logo.png
    await page.screenshot({'path': `src/assets/part2.png`, 'clip': {'x': x, 'y': y+h/2, 'width': w, 'height': h/2}});     // выполняем скриншот требуемой области и сохраняем его в logo.png
    await browser.close();

}

module.exports = GetScheduleTeacher;
const puppeteer = require('puppeteer');

const main = async (user, pass) => {
    
    //Configuración incial
    const url = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_WWWLogin'
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' })


    //Escribe el usuario en el input de usuario
    await page.waitFor('#UserID');
    await page.$eval('#UserID', (inputUser, value) => inputUser.value = value, user );

    //Escribe la contraseña en el input de contraseña
    await page.waitFor('#PIN > input[type=password]');
    await page.$eval('#PIN > input[type=password]', (inputPassword, value) => inputPassword.value = value, pass)

    //Le da click para ingresar a la pagina de la norte
    await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.pagebodydiv > form > p > input[type=submit]')
    ])

    // Espera por las etiquetas del estado academico y el nombre del estudiante
    await page.waitFor('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(2)');
    await page.waitFor('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)');

    //Toma el valor del estado academico y el nombre del estudiante
    const estate = await page.$eval('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(2)', estate => estate.innerText)
    const name = await page.$eval('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)', name => name.innerText)


    //Accede a información academica
    await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(1) > td:nth-child(2) > a')
    ])

    //Accede consulta de cumplimiento
    await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.pagebodydiv > table.menuplaintable > tbody > tr:nth-child(4) > td:nth-child(2) > a')
    ])

    //Asigna el periodo que desea saber su cumplimiento
    const period = await page.$eval('#term_in_id > option:nth-child(1)', periodo => periodo.value)
 
    await page.waitForSelector('#term_in_id')
    await page.select('#term_in_id', period)
    
    //Da click en el boton para acceder
    await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.pagebodydiv > form > table > tbody > tr:nth-child(3) > td.dedefault > input[type=submit]')
    ])

    //Selecciona la carrera
    await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.pagebodydiv > form > table > tbody > tr:nth-child(2) > td.ntdefault > a')
    ])

    browser.close()

    return {
        estate: estate,
        name: name.split(',')[1],
        period: period
    }
    
};

module.exports = main
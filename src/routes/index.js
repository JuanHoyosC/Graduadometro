const express = require('express')
const scraper = require('../scraper/index')
const modelar = require('../configModel/modelar')
const percent = require('../configModel/percent')
const router = express.Router()


router.post('', async (req, res) => {
    try {
        //Obtiene el usuario y la contraseña
        const user = req.body.user
        const password = req.body.password
        //Llama al scraper
        const data = await scraper(user, password)

        if (data.error == 'No hay error') {
            //Trae la data en un mejor formato
            const updateData = modelar(data.tableSubjects)

            const response = {
                status: 'Ingreso exitoso',
                state: data.state,
                name: data.name,
                period: data.period,
                credits: data.credits,
                points: data.points,
                prom: data.prom,
                percent: percent(updateData),
                tableSubjects: updateData
            }

            res.json(response)

        }else{

            res.json({status: 'Usuario o contraseña incorrecta'})
        }

    } catch (error) {
        console.log(error)
        res.json({ status: 'Hubo un error' })
    }
})




module.exports = router
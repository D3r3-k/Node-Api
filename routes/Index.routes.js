const { Router } = require('express')
const route = Router()

route.get('/', (req, res) => {
    res.json({
        message: "Bienvenido a Deportes S.A. API"
    })
})

module.exports = route
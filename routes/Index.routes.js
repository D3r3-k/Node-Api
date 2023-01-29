const { Router } = require('express')
const route = Router()

route.get('/', (req, res) => {
    res.json({
        message: "Bienvenido a Deportes S.A. API",
        documentation: `http://${req.hostname}${req.hostname === "localhost" ? ":3000" : ''}/doc`
    })
})

module.exports = route
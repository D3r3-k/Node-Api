const express = require('express')
const morgan = require('morgan')
const { validateToken } = require('./middlewares/mwAccessToken')
const path = require('path')
const port = process.env.PORT || 3000

//?: SWAGGER
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Proyecto API - Level Up",
            description: "API de Deportes S.A.",
            version: "1.0.0"
        }
    },
    apis: [`${path.join(__dirname, "./routes/*.js")}`],
}

//?: SETTINGS
const app = express()
require('dotenv').config()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//?: MIDDLEWARE
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
app.use('/', require('./routes/Index.routes'))
app.use('/api/auth', require('./routes/Auth.routes'))
app.use('/api/lineas', validateToken, require('./routes/Lineas.routes'))
app.use('/api/marcas', validateToken, require('./routes/Marcas.routes'))
app.use('/api/inventario', validateToken, require('./routes/Inventario.routes'))
app.use('/api/ingresos', validateToken, require('./routes/Ingresos.routes'))
app.use('/api/ventas', validateToken, require('./routes/Ventas.routes'))
app.use('*', require('./routes/NotFound.routes'))

app.listen(port, () => {
    console.log(`Servidor encendido, http://localhost:${port}`);
})
const express = require('express')
const app = express()
const morgan = require('morgan')
const { validateToken } = require('./middlewares/mwAccessToken')

//?: CONGIS
require('dotenv').config()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3000

// *: ROUTES
app.use('/', require('./routes/Index.routes'))
app.use('/auth', require('./routes/Auth.routes'))
app.use('/lineas', validateToken, require('./routes/Lineas.routes'))
app.use('/marcas', validateToken, require('./routes/Marcas.routes'))
app.use('/inventario', validateToken, require('./routes/Inventario.routes'))
app.use('/ingresos', validateToken, require('./routes/Ingresos.routes'))
app.use('/ventas', validateToken, require('./routes/Ventas.routes'))
app.use('*', require('./routes/NotFound.routes'))

app.listen(port, () => {
    console.log(`Servidor encendido, http://localhost:${port}`);
})
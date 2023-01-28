const { Router } = require('express')
const { ingresos_api, inventario_api } = require('../apis/productosAPI')
const route = Router()

//* VER INGRESOS
route.get('/', (req, res) => {
    res.status(200).json(ingresos_api)
})

//* AGREGAR AL INVENTARIO
route.post('/', (req, res) => {
    const { productos } = req.body
    if (!productos || productos.length === 0) return res.status(400).json({ message: 'Product id empty' })
    const error = []
    const success = []
    for (const i in productos) {
        const { id_producto, cantidad } = productos[i]
        const index = inventario_api.findIndex(item => item.id === id_producto)
        if (!cantidad) {
            error.push({ ...productos[i], error_message: 'Undefined quantity' })
        }
        if (index === -1) {
            error.push({ ...productos[i], error_message: 'Producto not Found' })
        }
        if (index >= 0 && cantidad) {
            success.push(productos[i])
        }
    }
    if (success.length > 0) {
        const newEntry = {
            id: (ingresos_api.length === 0) ? 1 : ingresos_api[ingresos_api.length - 1].id + 1,
            date: new Date().toDateString().slice(0, 10),
            productos: success
        }
        ingresos_api.push(newEntry)
        for (const i in success) {
            for (const j in inventario_api) {
                if (success[i].id_producto === inventario_api[j].id) {
                    inventario_api[j].stock += success[i].cantidad
                }
            }
        }
    }
    if (error.length > 0) return res.status(500).json({ message: 'Internal error', entered: success, not_entered: error })
    res.status(200).json({ message: 'Success', entrys: success })
})


module.exports = route
const { Router } = require('express')
const { ventas_api, inventario_api } = require('../apis/productosAPI')
const route = Router()

//* VER TODAS LAS VENTAS
route.get('/', (req, res) => {
    res.status(200).json(ventas_api)
})

//* HACER UNA VENTA
route.post('/', (req, res) => {
    const { productos } = req.body
    if (productos.length === 0) return res.status(400).json({ message: 'Empty Sales' })
    const error = []
    const success = []
    for (const i in productos) {
        const { id, cantidad } = productos[i]
        const index = inventario_api.findIndex(item => item.id === id)
        if (!cantidad) {
            error.push({ ...productos[i], error_message: 'Undefined quantity' })
        }
        if (index === -1) {
            error.push({ ...productos[i], error_message: 'Producto not Found' })
            continue
        }
        if (inventario_api[index].stock < cantidad) {
            error.push({ ...productos[i], error_message: 'Insufficient Stock' })
        }
        if (index >= 0 && cantidad && inventario_api[index].stock >= cantidad) {
            const successSale = {
                ...productos[i],
                subtotal: cantidad * inventario_api[index].precio
            }
            inventario_api[index].stock -= cantidad
            if (inventario_api[index].stock === 0) {
                inventario_api[index].activo = false
            }
            success.push(successSale)
        }
    }
    if (error.length === productos.length) return res.status(500).json({ message: 'Sale Failed', product_error: error })
    const newSale = {
        id: (ventas_api.length === 0) ? 1 : ventas_api[ventas_api.length - 1].id + 1,
        productos: success,
        total: success.map(item => item.subtotal).reduce((prev, curr) => prev + curr, 0)
    }
    if (success.length > 0) {
        ventas_api.push(newSale)
    }
    res.status(201).json({ message: 'Sale Success', sale_products: newSale, product_error: error })


})

module.exports = route
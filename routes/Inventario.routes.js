const { Router } = require('express')
const { inventario_api, marcas_api, lineas_api } = require('../apis/productosAPI')
const route = Router()


//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
//*(GET)        VER TODOS LOS ACTIVOS
//*(GET)        VER DADO UN ID
//*(POST)       CREAR
//*(PUT)        EDITAR
//*(DELETE)     ELIMINACION SUAVE

route.get('/', (req, res) => {
    res.status(200).json(inventario_api)
})

route.get('/activos', (req, res) => {
    const inventarioActivo = inventario_api.filter(item => item.activo === true)
    res.status(200).json(inventarioActivo)
})

route.get('/:id', (req, res) => {
    const { id } = req.params
    const producto = inventario_api.find(item => item.id === parseInt(id))
    if (!producto) return res.status(404).json({ message: 'Product not Found' })
    res.status(200).json(producto)
})

route.post('/', (req, res) => {
    const { marca: marca_id, linea: linea_id, precio, stock } = req.body
    if (!marca_id || !linea_id || !precio || !stock) return res.status(400).json({ message: 'Empty data, 0 values or incomplete' })
    if (!marcas_api.find(item => item.id === marca_id)) return res.status(404).json({ message: 'Brand not Found' })
    if (!lineas_api.find(item => item.id === linea_id)) return res.status(404).json({ message: 'Product Line not Found' })
    const newID = marca_id + '0' + linea_id + '0' + Math.floor(Math.random() * 999 + 100)
    const newProduct = {
        id: parseInt(newID),
        marca: marca_id,
        linea: linea_id,
        precio: precio,
        stock: stock,
        activo: true
    }
    inventario_api.push(newProduct)
    res.status(201).json({ success: 'Product created', product: newProduct })
})

route.put('/', (req, res) => {
    const { id, data } = req.body
    if (!id) return res.status(400).json({ message: 'Empty id' })
    if (!data) return res.status(400).json({ message: 'Empty data' })
    const index = inventario_api.findIndex(item => item.id === parseInt(id))
    if (index === -1) return res.status(404).json({ message: 'Product not Found' })
    const { marca, linea, stock, activo, precio } = data
    if (marca !== undefined) {
        if (!marcas_api.find(item => item.id === marca)) return res.status(404).json({ message: 'Brand not Found' })
    }
    if (linea !== undefined) {
        if (!lineas_api.find(item => item.id === linea)) return res.status(404).json({ message: 'Product Line not Found' })
    }
    inventario_api[index] = {
        ...inventario_api[index],
        precio: (precio === undefined) ? inventario_api[index].precio : precio,
        marca: (marca === undefined) ? inventario_api[index].marca : marca,
        linea: (linea === undefined) ? inventario_api[index].linea : linea,
        stock: (stock === undefined) ? inventario_api[index].stock : stock,
        activo: (activo === undefined) ? inventario_api[index].activo : activo,
    }
    res.status(200).json({ message: 'Product Update Success', update: inventario_api[index] })

})

route.delete('/', (req, res) => {
    const { id } = req.body
    if (id === undefined) return res.status(406).json({ message: 'Empty id' })
    const index = inventario_api.findIndex(item => item.id === parseInt(id))
    if (index === -1 || inventario_api[index].activo === false) return res.status(404).json({ message: 'Product does not exist' })
    inventario_api[index].activo = false
    res.status(200).json({ message: 'Product deleted' })

})

module.exports = route
const { Router } = require('express')
const { marcas_api } = require('../apis/productosAPI')
const route = Router()

//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
route.get('/', (req, res) => {
    res.status(200).json(marcas_api)
})

//*(GET)        VER TODOS LOS ACTIVOS
route.get('/activos', (req, res) => {
    const marcasActivas = marcas_api.filter(item => item.activo === true)
    res.status(200).json(marcasActivas)
})

//*(GET)        VER DADO UN ID
route.get('/:id', (req, res) => {
    const { id } = req.params
    const marca = marcas_api.find(item => item.id === parseInt(id))
    if (!marca) return res.status(404).json({ message: 'Product Brand not Found' })
    res.status(200).json(marca)
})

//*(POST)       CREAR
route.post('/', (req, res) => {
    const { marca } = req.body
    if (!marca) return res.status(400).json({ message: 'Empty data' })
    const newBrand = {
        id: (marcas_api.length === 0) ? 1 : marcas_api[marcas_api.length - 1].id + 1,
        marca: marca,
        activo: true
    }
    const repeatedBrand = marcas_api.find(item => item.marca === marca)
    if (repeatedBrand) return res.status(400).json({ message: 'data exist' })
    marcas_api.push(newBrand)
    res.status(201).json({ success: 'Product Brand created', product: newBrand })
})

//*(PUT)        EDITAR
route.put('/', (req, res) => {
    const { id, data } = req.body
    if (!id && !data) return res.status(400).json({ message: 'Empty id and data' })
    if (!id && data) return res.status(400).json({ message: 'Missing id' })
    if (id && !data) return res.status(400).json({ message: 'Missing update data' })

    const index = marcas_api.findIndex(item => item.id === parseInt(id))
    if (index === -1) return res.status(404).json({ message: 'Product Brand does not exist' })
    marcas_api[index] = {
        ...marcas_api[index],
        marca: (data.marca === undefined) ? marcas_api[index].marca : data.marca,
        activo: (data.activo === undefined) ? marcas_api[index].activo : data.activo
    }
    res.status(200).json(marcas_api[index])
})

//*(DELETE)     ELIMINACION SUAVE
route.delete('/', (req, res) => {
    const { id } = req.body
    if (id === undefined) return res.status(400).json({ message: 'Empty id' })

    const index = marcas_api.findIndex(item => item.id === parseInt(id))
    if (index === -1 || marcas_api[index].activo === false) return res.status(404).json({ message: 'Product Brand does not exist' })
    marcas_api[index].activo = false
    res.status(200).json({ message: 'Product Brand deleted' })

})

module.exports = route
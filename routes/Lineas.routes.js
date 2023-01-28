const { Router } = require('express')
const { lineas_api } = require('../apis/productosAPI')
const route = Router()

//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
//*(GET)        VER TODOS LOS ACTIVOS
//*(GET)        VER DADO UN ID
//*(POST)       CREAR
//*(PUT)        EDITAR
//*(DELETE)     ELIMINACION SUAVE

route.get('/', (req, res) => {
    res.status(200).json(lineas_api)
})

route.get('/activos', (req, res) => {
    const lineasActivas = lineas_api.filter(item => item.activo === true)
    res.status(200).json(lineasActivas)
})

route.get('/:id', (req, res) => {
    const { id } = req.params
    const linea = lineas_api.find(item => item.id === parseInt(id))
    if (!linea) return res.status(404).json({ message: 'Product Line not Found' })
    res.status(200).json(linea)
})

route.post('/', (req, res) => {
    const { linea } = req.body
    if (!linea) return res.status(400).json({ message: 'Empty data' })
    const newLine = {
        id: (lineas_api.length === 0) ? 1 : lineas_api[lineas_api.length - 1].id + 1,
        linea: linea,
        activo: true
    }
    const repeatedLinea = lineas_api.find(item => item.linea === linea)
    if (repeatedLinea) return res.status(400).json({ message: 'data exist' })
    lineas_api.push(newLine)
    res.status(201).json({ success: 'Product Line created', product: newLine })
})

route.put('/', (req, res) => {
    const { id, data } = req.body
    if (!id && !data) return res.status(400).json({ message: 'Empty id and data' })
    if (!id && data) return res.status(400).json({ message: 'Missing id' })
    if (id && !data) return res.status(400).json({ message: 'Missing update data' })

    const index = lineas_api.findIndex(item => item.id === parseInt(id))
    if (index === -1) return res.status(404).json({ message: 'Product line does not exist' })
    console.log(data.activo);
    lineas_api[index] = {
        ...lineas_api[index],
        linea: (data.linea === undefined) ? lineas_api[index].linea : data.linea,
        activo: (data.activo === undefined) ? lineas_api[index].activo : data.activo
    }
    res.status(200).json({ message: 'Product Line Update success', update: lineas_api[index] })
})

route.delete('/', (req, res) => {
    const { id } = req.body
    if (id === undefined) return res.status(400).json({ message: 'Empty id' })

    const index = lineas_api.findIndex(item => item.id === parseInt(id))
    if (index === -1 || lineas_api[index].activo === false) return res.status(404).json({ message: 'Product line does not exist' })
    lineas_api[index].activo = false
    res.status(200).json({ message: 'Product Line deleted' })

})

module.exports = route
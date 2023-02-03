const { Router } = require('express')
const { lineas_api } = require('../apis/productosAPI')
const route = Router()
/**
 * @swagger
 * components:
 *  schemas:
 *      LineaBody:
 *          type: object
 *          properties:
 *              linea:
 *                  type: string
 *                  description: Nombre de la linea.
 *          required:
 *              - linea
 *          example:
 *              linea: Short Deportivo
 *      LineaUpdateBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID de la linea a editar.
 *              data:
 *                  type: object
 *                  description: Datos que se desean editar.
 *              linea:
 *                  type: string
 *                  description: Nombre de la linea.
 *              activo:
 *                  type: boolean
 *                  description: Estado de la linea.
 *          required:
 *              - id
 *              - data
 *          example:
 *              id: 54521
 *              data: {linea: Tenis deportivos, activo: false}
 *      LineaDeleteBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID de la linea a borrar.
 *          required:
 *              - id
 *          example:
 *              id: 54521
 */
//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
//*(GET)        VER TODOS LOS ACTIVOS
//*(GET)        VER DADO UN ID
//*(POST)       CREAR
//*(PUT)        EDITAR
//*(DELETE)     ELIMINACION SUAVE

/**
 * @swagger
 * /api/lineas:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver Lineas.
 *      tags: [Lineas]
 *      responses:
 *          200:
 *              description: Mostrar lista de lineas de productos (incluyendo eliminados).
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
route.get('/', (req, res) => {
    res.status(200).json(lineas_api)
})

/**
 * @swagger
 * /api/lineas/activos:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver lineas activas.
 *      tags: [Lineas]
 *      responses:
 *          200:
 *              description: Mostrar lista de lineas (solo activos).
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
route.get('/activos', (req, res) => {
    const lineasActivas = lineas_api.filter(item => item.activo === true)
    res.status(200).json(lineasActivas)
})

/**
 * @swagger
 * /api/lineas/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver linea segun ID.
 *      tags: [Lineas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: El id de la linea
 *      responses:
 *          200:
 *              description: Mostrar linea de producto segun su id.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: Producto no encontrado.
 */
route.get('/:id', (req, res) => {
    const { id } = req.params
    const linea = lineas_api.find(item => item.id === parseInt(id))
    if (!linea) return res.status(404).json({ message: 'Product Line not Found' })
    res.status(200).json(linea)
})

/**
 * @swagger
 * /api/lineas:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crear un nueva Linea.
 *      tags: [Lineas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/LineaBody'
 *      responses:
 *          201:
 *              description: Linea creada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
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

/**
 * @swagger
 * /api/lineas:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Editar una Linea.
 *      tags: [Lineas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/LineaUpdateBody'
 *      responses:
 *          200:
 *              description: Linea actualizada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: Datos vacios o no encontrados.
 */
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

/**
 * @swagger
 * /api/lineas:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Borrar una Linea.
 *      tags: [Lineas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/LineaDeleteBody'
 *      responses:
 *          200:
 *              description: Linea Borrada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: La linea no existe.
 */
route.delete('/', (req, res) => {
    const { id } = req.body
    if (id === undefined) return res.status(400).json({ message: 'Empty id' })

    const index = lineas_api.findIndex(item => item.id === parseInt(id))
    if (index === -1 || lineas_api[index].activo === false) return res.status(404).json({ message: 'Product line does not exist' })
    lineas_api[index].activo = false
    res.status(200).json({ message: 'Product Line deleted' })

})

module.exports = route
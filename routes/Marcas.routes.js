const { Router } = require('express')
const { marcas_api } = require('../apis/productosAPI')
const route = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      MarcaBody:
 *          type: object
 *          properties:
 *              marca:
 *                  type: string
 *                  description: Nombre de la marca.
 *          required:
 *              - marca
 *          example:
 *              marca: New Era
 *      MarcaUpdateBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID de la linea a editar.
 *              data:
 *                  type: object
 *                  description: Datos que se desean editar.
 *              marca:
 *                  type: string
 *                  description: Nombre de la marca.
 *              activo:
 *                  type: boolean
 *                  description: Estado de la marca.
 *          required:
 *              - id
 *              - data
 *          example:
 *              id: 54521
 *              data: {marca: New Era, activo: false}
 *      MarcaDeleteBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID de la marca a borrar.
 *          required:
 *              - id
 *          example:
 *              id: 54521
 */

/**
 * @swagger
 * /api/marcas:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver Marcas.
 *      tags: [Marcas]
 *      responses:
 *          200:
 *              description: Mostrar lista de marcas (incluyendo eliminados).
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
route.get('/', (req, res) => {
    res.status(200).json(marcas_api)
})

/**
 * @swagger
 * /api/marcas/activos:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver marcas activas.
 *      tags: [Marcas]
 *      responses:
 *          200:
 *              description: Mostrar lista de marcas (solo activos).
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
//*(GET)        VER TODOS LOS ACTIVOS
route.get('/activos', (req, res) => {
    const marcasActivas = marcas_api.filter(item => item.activo === true)
    res.status(200).json(marcasActivas)
})

/**
 * @swagger
 * /api/marcas/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver marca segun ID.
 *      tags: [Marcas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: El id de la marca
 *      responses:
 *          200:
 *              description: Mostrar marca segun su id.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: Producto no encontrado.
 */
//*(GET)        VER DADO UN ID
route.get('/:id', (req, res) => {
    const { id } = req.params
    const marca = marcas_api.find(item => item.id === parseInt(id))
    if (!marca) return res.status(404).json({ message: 'Product Brand not Found' })
    res.status(200).json(marca)
})

/**
 * @swagger
 * /api/marcas:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crear un nueva Marca.
 *      tags: [Marcas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MarcaBody'
 *      responses:
 *          201:
 *              description: Marca creada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 */
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

/**
 * @swagger
 * /api/marcas:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Editar una marca.
 *      tags: [Marcas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MarcaUpdateBody'
 *      responses:
 *          200:
 *              description: Marca actualizada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: Datos vacios o no encontrados.
 */
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

/**
 * @swagger
 * /api/marcas:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Borrar una Marca.
 *      tags: [Marcas]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MarcaDeleteBody'
 *      responses:
 *          200:
 *              description: Marca Borrada.
 *          400:
 *              description: Token invalido.
 *          401:
 *              description: Usuario no autorizado.
 *          404:
 *              description: La Marca no existe.
 */
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
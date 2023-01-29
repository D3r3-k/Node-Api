const { Router } = require('express')
const { inventario_api, marcas_api, lineas_api } = require('../apis/productosAPI')
const route = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductoBody:
 *          type: object
 *          properties:
 *              marca:
 *                  type: integer
 *                  description: ID de la marca.
 *              linea:
 *                  type: integer
 *                  description: ID de la linea.
 *              precio:
 *                  type: integer
 *                  description: Precio del producto.
 *              stock:
 *                  type: integer
 *                  description: Cantidad total del inventario.
 *          required:
 *              - marca
 *              - linea
 *              - precio
 *              - stock
 *          example:
 *              marca: 4
 *              linea: 3
 *              precio: 100
 *              stock: 25
 *      ProductoUpdateBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID del producto a editar.
 *              data:
 *                  type: object
 *                  description: Datos que se desean editar.
 *              precio:
 *                  type: integer
 *                  description: Precio del producto.
 *              marca:
 *                  type: integer
 *                  description: Marca del producto.
 *              linea:
 *                  type: integer
 *                  description: Linea del producto.
 *              stock:
 *                  type: integer
 *                  description: Cantidad total del inventario.
 *              activo:
 *                  type: boolean
 *                  description: Estado del inventario.
 *          required:
 *              - id
 *              - data
 *          example:
 *              id: 54521
 *              data: {marca: 4,linea: 3,precio: 100, stock: 25, activo: false}
 *      ProductoDeleteBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID del producto a borrar.
 *          required:
 *              - id
 *          example:
 *              id: 54521
 *      Producto:
 *          type: object
 *          example:
 *              id: 1
 *              marca: 4
 *              linea: 3
 *              precio: 100
 *              stock: 25
 *              activo: true
 *      ProductoNotFound:
 *          type: object
 *          example:
 *              message: "Product not Found"
 *      ProductoUpdateSuccess:
 *          type: object
 *          example:
 *              message: "Product Update Success"
 *      ProductoDeleteSuccess:
 *          type: object
 *          example:
 *              message: "Product Deleted"
 */
//*(GET)        VER TODOS (INCLUYENDO ELIMINADOS)
//*(GET)        VER TODOS LOS ACTIVOS
//*(GET)        VER DADO UN ID
//*(POST)       CREAR
//*(PUT)        EDITAR
//*(DELETE)     ELIMINACION SUAVE
/**
 * @swagger
 * /api/inventario:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver inventario.
 *      tags: [Inventario]
 *      responses:
 *          200:
 *              description: Mostrar lista del inventario (incluyendo eliminados).
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Producto'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 */
route.get('/', (req, res) => {
    res.status(200).json(inventario_api)
})
/**
 * @swagger
 * /api/inventario/activos:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver inventario activos.
 *      tags: [Inventario]
 *      responses:
 *          200:
 *              description: Mostrar lista del inventario (solo activos).
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Producto'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 */
route.get('/activos', (req, res) => {
    const inventarioActivo = inventario_api.filter(item => item.activo === true)
    res.status(200).json(inventarioActivo)
})

/**
 * @swagger
 * /api/inventario/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver producto segun ID.
 *      tags: [Inventario]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: El id del producto
 *      responses:
 *          200:
 *              description: Mostrar producto segun su id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Producto'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 *          404:
 *              description: Producto no encontrado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoNotFound'
 */
route.get('/:id', (req, res) => {
    const { id } = req.params
    const producto = inventario_api.find(item => item.id === parseInt(id))
    if (!producto) return res.status(404).json({ message: 'Product not Found' })
    res.status(200).json(producto)
})

/**
 * @swagger
 * /api/inventario:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Crear un nuevo producto.
 *      tags: [Inventario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductoBody'
 *      responses:
 *          201:
 *              description: Producto creado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Producto'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 *          404:
 *              description: Producto, Marca o Linea no encontrada.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoNotFound'
 */
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

/**
 * @swagger
 * /api/inventario:
 *  put:
 *      security:
 *          - bearerAuth: []
 *      summary: Editar un producto.
 *      tags: [Inventario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductoUpdateBody'
 *      responses:
 *          200:
 *              description: Producto actualizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoUpdateSuccess'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 *          404:
 *              description: Datos vacios o no encontrados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoNotFound'
 */
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

/**
 * @swagger
 * /api/inventario:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      summary: Borrar un producto.
 *      tags: [Inventario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProductoDeleteBody'
 *      responses:
 *          200:
 *              description: Producto Borrado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoDeleteSuccess'
 *          400:
 *              description: Token invalido.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/NoTokenAccess'
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 *          404:
 *              description: El producto no existe.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ProductoNotFound'
 */
route.delete('/', (req, res) => {
    const { id } = req.body
    if (id === undefined) return res.status(406).json({ message: 'Empty id' })
    const index = inventario_api.findIndex(item => item.id === parseInt(id))
    if (index === -1 || inventario_api[index].activo === false) return res.status(404).json({ message: 'Product does not exist' })
    inventario_api[index].activo = false
    res.status(200).json({ message: 'Product deleted' })

})

module.exports = route
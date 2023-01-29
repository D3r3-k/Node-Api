const { Router } = require('express')
const { ingresos_api, inventario_api } = require('../apis/productosAPI')
const route = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      Lista-Ingresos:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: ID de ingreso al inventario.
 *              fecha:
 *                  type: string
 *                  format: date
 *                  description: Fecha de ingreso..
 *              productos:
 *                  type: array
 *                  description: Lista de productos ingresados al inventario.
 *                  items:
 *                      type: object
 *          example:
 *              id: 1
 *              fecha: "Sat Jan 30"
 *              productos: [{id_producto: 4010436, cantidad: 12 },{id_producto: 5070852, cantidad: 442 }]
 *      Agregar-Ingresos:
 *          type: object
 *          properties:
 *              id_producto:
 *                  type: integer
 *                  description: ID del producto almacenado en el inventario.
 *              cantidad:
 *                  type: integer
 *                  description: Cantidad de productos para agregar al inventario.
 *          example:
 *              id_producto: 4010436
 *              cantidad: 12
 */


/**
 * @swagger
 * /api/ingresos:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Ver historial de ingresos.
 *      tags: [Ingresos]
 *      responses:
 *          200:
 *              description: Historial de los productos ingresados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Lista-Ingresos'
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
//* VER INGRESOS
route.get('/', (req, res) => {
    res.status(200).json(ingresos_api)
})

/**
 * @swagger
 * /api/ingresos:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Agrega una lista de productos al inventario.
 *      tags: [Ingresos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Agregar-Ingresos'
 *      responses:
 *          500:
 *              description: Error al ingresar productos.
 *          400:
 *              description: Lista de productos vacia.
 *          401:
 *              description: Usuario no autorizado.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthDenied'
 *          200:
 *              description: Productos ingresados exitosamente.
 */
//* AGREGAR AL INVENTARIO
route.post('/', (req, res) => {
    const productos = req.body
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
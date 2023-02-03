const { Router } = require('express')
const { generateAccessToken } = require('../middlewares/mwAccessToken')
const route = Router()

const usuarios_db = require('../apis/dbUsuarios.json')

// Auth user
/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *      Body:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: Correo electronico del usuario
 *              password:
 *                  type: string
 *                  description: Contraseña del usuario
 *          required:
 *              - email
 *              - password
 *          example:
 *              email: "admin@gmail.com"
 *              password: "000"
 */


/**
 * @swagger
 * /api/auth:
 *  post:
 *      summary: Autentifica al usuario
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Body'
 *      responses:
 *          200:
 *              description: Usuario autenticado
 *          404:
 *              description: Usuario no encontrado
 */
route.post('/', (req, res) => {
    const { email, password } = req.body
    const userFound = usuarios_db.find(u => u.email === email && u.password === password)
    if (!userFound) return res.status(404).json({ message: 'User not Found' })
    const accessToken = generateAccessToken(userFound)
    return res.header('authorization', accessToken).status(200).json({ message: 'Authenticated User', token: accessToken })
})

module.exports = route
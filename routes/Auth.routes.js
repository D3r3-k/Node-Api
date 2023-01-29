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
 *      Auth:
 *          type: object
 *          example:
 *              message: "Authentication User"
 *              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMDAwIiwiaWF0IjoxNjc0OTY0OTI1LCJleHAiOjE2NzUwNTEzMjV9.0HybQPUfVpGNYr2jvomUOY1l89BP8DIu434eVaD33sc"
 *      AuthNotFound:
 *          type: object
 *          example:
 *              message: "User not Found"
 *      AuthDenied:
 *          type: object
 *          example:
 *              message: "Access denied"
 *      NoTokenAccess:
 *          type: object
 *          example:
 *              message: "Access denied, Token expired or Incorrect"
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Auth'
 *          404:
 *              description: Usuario no encontrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/AuthNotFound'
 */
route.post('/', (req, res) => {
    const { email, password } = req.body
    const userFound = usuarios_db.find(u => u.email === email && u.password === password)
    if (!userFound) return res.status(404).json({ message: 'User not Found' })
    const accessToken = generateAccessToken(userFound)
    return res.header('authorization', accessToken).status(200).json({ message: 'Authenticated User', token: accessToken })
})

module.exports = route
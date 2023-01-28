const { Router } = require('express')
const { generateAccessToken } = require('../middlewares/mwAccessToken')
const route = Router()

const usuarios_db = require('../apis/dbUsuarios.json')

route.post('/', (req, res) => {
    const { email, password } = req.body
    const userFound = usuarios_db.find(u => u.email === email && u.password === password)
    if (!userFound) return res.status(404).json({ message: 'User not Found' })
    const accessToken = generateAccessToken(userFound)
    return res.status(200).json({ message: 'Authenticated User', token: accessToken })
})

module.exports = route
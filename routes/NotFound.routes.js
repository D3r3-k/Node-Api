const { Router } = require('express')
const route = Router()

route.get('/', (req, res) => {
    res.json({ message: 'Route not Found' })
})

module.exports = route
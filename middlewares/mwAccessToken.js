const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' })
}

function validateToken(req, res, next) {
    const accessToken = req.headers['authorization']
    if (!accessToken) return res.status(401).json({ message: 'Access denied' })
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, response) => {
        if (err) return res.status(400).json({ message: 'Access denied, Token expired or Incorrect' })
        next()
    })
}

module.exports = { generateAccessToken, validateToken }
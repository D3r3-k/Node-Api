const jwt = require('jsonwebtoken');
const { token } = require('morgan');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' })
}

function validateToken(req, res, next) {
    const accessToken = req.headers['authorization']
    if (!accessToken) return res.status(401).json({ message: 'Access denied' })
    let token = ''
    if (accessToken.includes('Bearer')) {
        const arr = accessToken.split(' ')
        token = arr[1]
    } else {
        token = accessToken
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, response) => {
        if (err) return res.status(400).json({ message: 'Access denied, Token expired or Incorrect' })
        next()
    })
}

module.exports = { generateAccessToken, validateToken }

const jwt = require('jsonwebtoken')

// const jwtSecret = require('../config/key.js')

const tokenSecret = process.env.SECRET

const jwtVerify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, tokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }

            req.user = user
            return next()
        })
    } else {
        res.sendStatus(401)
    }
}

module.exports = jwtVerify
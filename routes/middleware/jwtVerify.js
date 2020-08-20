
const jwt = require('jsonwebtoken')

const jwtSecret = require('../../config/key')

const tokenSecret = jwtSecret.jwtSecret

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

function auth (req, res, next) {
    // Get auth header value 
    const bearerAuthHeader = req.headers['authorization']
    // check if bearer if undefined 
    if (bearerAuthHeader === undefined) {
        // Forbidden 
        res.sendStatus(403)
    } else {
        const bearer = bearerAuthHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken
        // Next middlleware
        next()
    }
}

module.exports = auth
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const db = require('./models')
const apiRoutes = require('./app/routes/apiRoutes.js')

const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// Static directory
// app.use(express.static('public'));

apiRoutes(app, db);

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the api'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: 'Post created',
                authData
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    jwt.sign({
        user: req.body.name,

    }, 'secretKey', {expiresIn: '1d'}, (err, token) => {
        res.json({
            token: token
        })
    })
})

// Format of token

//VerifyToken
function verifyToken(req, res, next) {
    // Get auth header value 
    const bearerAuthHeader = req.headers['authorization']
    // check if bearer if undefined 
    if (typeof bearerAuthHeader !== 'undefined' || typeof bearerAuthHeader !== undefined) {
        const bearer = bearerAuthHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken
        // Next middlleware
        next()
    } else {
        // Forbidden 
        res.sendStatus(403)
        // }
    }
}

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(`Listening on PORT ${PORT}`)
    });
});
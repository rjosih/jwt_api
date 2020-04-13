const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const db = require('./models')
const apiRoutes = require('./routes/apiRoutes.js')

const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.post('/api/login', (req, res) => {
    jwt.sign({
        user: req.body.name,
    }, 'secretKey', {expiresIn: '1d'}, (err, token) => {
        res.json({
            token: token,
            message: 'Auth succeed',
        })
        res.sendStatus(200)
    })
})

apiRoutes(app, db);

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(`Listening on PORT ${PORT}`)
    });
});
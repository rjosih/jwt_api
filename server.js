const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

const db = require("./models")
const apiRoutes = require("./routes/apiRoutes.js")
const webhookRoutes = require('./routes/webhook.js')
const jwtSecret = require('./config/key.js')
const PORT = process.env.PORT || 3000

const tokenSecret = jwtSecret.jwtSecret
const refreshTokenSecret = 'somerandomstringforrefreshtoken'

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
]

const refreshTokens = [];


// Handle data parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: "application/vnd.api+json" }))

app.post('/login', (req, res) => {
      const { username, password } = req.body;
      const user = users.find(u => { return u.username === username && u.password === password });
  
      if (user) {
          // generate an access token
          const accessToken = jwt.sign({ username: user.username, role: user.role }, tokenSecret, { expiresIn: '10m' });
          const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
  
          refreshTokens.push(refreshToken)
          res.json({
              accessToken,
              refreshToken
          });
      } else {
          res.send('Username or password incorrect')
      }
})

apiRoutes(app, db)
webhookRoutes(app, db)

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`)
  })
})

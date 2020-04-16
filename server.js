const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

const db = require("./models")
const apiRoutes = require("./routes/apiRoutes.js")
const jwtSecret = require("./config/key.js")
const PORT = process.env.PORT || 3000

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }))

app.post('/api/login', (req, res) => {
  jwt.sign(
    {
      user: req.body.name,
    },
    jwtSecret.jwtSecret,
    { expiresIn: '1d' },
    (err, token) => {
        var links = [
            { 
                self: 
                [                    
                    {
                        method: 'POST',
                        href: req.url, 
                        rel: 'auth'
                    }
                ],
                to: 
                [

                    {
                        method: 'GET',
                        href: '/api/all',
                        rel: 'items'
                    }
                ] 
            }
        ]
      if (err) {
        res.status(500).json({
          message: 'Something went wrong',
        });
      } else {
        res.status(200).json({
          token,
          links,
        });
      }
    }
  );
});

apiRoutes(app, db);

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`);
  });
});

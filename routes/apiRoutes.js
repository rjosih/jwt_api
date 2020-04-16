const jwt = require("jsonwebtoken")

const jwtSecret = require("../config/key.js")
const jwtVerify = require("./middleware/auth.js")

module.exports = (app, db) => {
  // GET ALL
  app.get("/api/all", (req, res) => {
    db.Item.findAll({}).then(function (result) {
        var links = [
            { 
                self: 
                [
                    {
                        method: 'GET',
                        href: req.url, 
                        rel: 'items'
                    }
                ],
                to: 
                [
                    {
                        method: 'GET',
                        href: '/api/1',
                        rel: 'getItemById'
                    },
                    {
                        method: 'POST',
                        href: '/api/new',
                        rel: 'create'
                    }
                ]
            }
        ]

      if (result.length === 0) {
        for (var i = 0; i < 15; i++) {
          db.Item.create({
            name: "standardturkey",
            category: "standardmeat",
            price: 400,
          })
        }
        res.status(200).json({
          message: "If you want to populate data click send again",
        })
      } else {
        res.status(200).json({
          result,
          links
        })
      }
    })
  })

  // GET ITEM BY ID
  app.get("/api/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
        var links = [
            { 
                self: 
                [                    
                    {
                        method: 'GET',
                        href: req.url, 
                        rel: 'getItemById'
                    }
                ],
                to: 
                [
                    {
                        method: 'POST',
                        href: '/api/new',
                        rel: 'create'
                    },
                    {
                        method: 'GET',
                        href: '/api/all',
                        rel: 'items'
                    },
                    { 
                        method: 'DELETE',
                        href: '/api/delete/' + req.params.id,
                        rel: 'deleteById'
                    },
                    { 
                        method: 'PUT',
                        href: '/api/update/' + req.params.id,
                        rel: 'updateById'
                    }
                ] 
            }
        ]
      if (err) {
        res.status(403)
      } else {
        db.Item.findOne({
          where: {
            id: req.params.id,
          },
        }).then((result) => {
          if (result === null) {
            res.status(404).json({
              message: "Item not found.",
            })
          } else {
            res.status(200).json({
              result,
              links
            })
          }
        })
      }
    })
  })

  // CREATE NEW
  app.post("/api/new", jwtVerify, (req, res) => {
    var links = [
        { 
            self: 
            [
                { 
                    method: 'POST',
                    href: req.url, 
                    rel: 'create'
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
    jwt.verify(req.token, jwtSecret.jwtSecret, (err) => {
      if (err) {
        res.status(403)
      } else {
        db.Item.create({
          name: req.body.name || "turkey",
          category: req.body.category || "meat",
          price: req.body.price || 100,
        }).then((result) => {
          res.status(201).json({
            message: "Item created successfully!",
            result,
            links
          })
        })
      }
    })
  })

  // UPDATE BY ID
  app.put("/api/update/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err) => {
      if (err) {
        res.status(403)
      } else {
        db.Item.update(
          {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        ).then((result) => {
            console.log(result[0])
          if (result[0] === 1) {
            res.status(200).json({
                message: "Item updated successfully!",
                result,
            })
          } else if (result[0] === 0) {
            res.status(404).json({
              message: "Item not found",
            })
          } else {
              res.status(500).json({
                  message: 'Something went wrong'
              })
          }
        })
      }
    })
  })

  // DELETE BY ID
  app.delete("/api/delete/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err) => {
      if (err) {
        res.status(403)
      } else {
        db.Item.destroy({
          where: {
            id: req.params.id,
          },
        }).then((result) => {
          if (result === 1) {
            res.status(200).json({
              message: "Item deleted successfully!",
            });
          } else if (result === 0) {
            res.status(404).json({
              message: "Item not found",
            })
          } else {
              res.status(500).json({
                  message: 'Something went wrong'
              })
          }
        })
      }
    })
  })
}

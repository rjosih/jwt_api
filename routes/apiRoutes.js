const webhook = require('../webhook/webhooks.js')
const jwtVerify = require('../middleware/jwtVerify.js')

module.exports = (app, db) => {
  // GET ALL
  app.get('/api/all', jwtVerify, (req, res) => {
    const { role } = req.user

    if (role !== 'admin' && role !== 'member') {
      return res.sendStatus(403)
    }

    var links = [
      {
        self: [
          {
            method: 'GET',
            href: req.url,
            rel: 'items',
          },
        ],
        to: [
          {
            method: 'GET',
            href: '/api/1',
            rel: 'getItemById',
          },
          {
            method: 'POST',
            href: '/api/new',
            rel: 'create',
          },
        ],
      },
    ]

    db.Item.findAll({}).then((result) => {
      if (result.length === 0) {
        for (var i = 0; i < 15; i++) {
          db.Item.create({
            name: 'standardturkey',
            category: 'standardmeat',
            price: 400,
          })
        }

        db.Item.findAll({}).then((result) => {
          res.status(200).json({
            result
          })
        })
      } else if (result) {
        res.status(200).json({
          result,
          links,
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong',
        })
      }
    })
  })

  // GET ITEM BY ID
  app.get('/api/:id', jwtVerify, (req, res) => {
    const { role } = req.user

    if (role !== 'admin' && role !== 'member') {
      return res.sendStatus(403)
    }

    var links = [
      {
        self: [
          {
            method: 'GET',
            href: req.url,
            rel: 'getItemById',
          },
        ],
        to: [
          {
            method: 'POST',
            href: '/api/new',
            rel: 'create',
          },
          {
            method: 'GET',
            href: '/api/all',
            rel: 'items',
          },
          {
            method: 'DELETE',
            href: '/api/delete/' + req.params.id,
            rel: 'deleteById',
          },
          {
            method: 'PUT',
            href: '/api/update/' + req.params.id,
            rel: 'updateById',
          },
        ],
      },
    ]

    db.Item.findOne({
      where: {
        id: req.params.id,
      },
    }).then((result) => {
      if (result === null) {
        res.status(404).json({
          message: 'Item not found.',
        });
      } else {
        res.status(200).json({
          result,
          links,
        })
      }
    })
  })

  // CREATE NEW
  app.post('/api/new', jwtVerify, (req, res) => {
    const { role } = req.user

    if (role !== 'admin') {
      return res.sendStatus(403)
    }

    var links = [
      {
        self: [
          {
            method: 'POST',
            href: req.url,
            rel: 'create',
          },
        ],
        to: [
          {
            method: 'GET',
            href: '/api/all',
            rel: 'items',
          },
        ],
      },
    ]

    
    db.Item.create({
      name: req.body.name || 'turkey',
      category: req.body.category || 'meat',
      price: req.body.price || 100,
    })
    .then((result) => {
      webhook.trigger('New item', { data: result })
          var item = {
            name: req.body.name, 
            category: req.body.category, 
            price: req.body.price
          }

          res.status(201).json({
            message: 'Item created successfully!',
            item,
            links,
          });
        })
        .catch(() => {
          res.status(500).json({
            message: 'Item creation failed',
          })
        })
  })

  // UPDATE BY ID
  app.put('/api/update/:id', jwtVerify, (req, res) => {
    const { role } = req.user
    var item = {
      name: req.body.name, 
      category: req.body.category, 
      price: req.body.price
    }

    if (role !== 'admin') {
      return res.sendStatus(403)
    }

    if (req.body.name === undefined) {
      res.status(400).json({
        message: 'Invalid name',
      })
    } else if (req.body.category === undefined) {
      res.status(400).json({
        message: 'Invalid category',
      })
    } else if (isNaN(req.body.price) || req.body.price === undefined) {
      res.status(400).json({
        message: 'Invalid price',
      })
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
        if (result[0] === 1) {
          res.status(200).json({
            message: 'Item updated successfully!',
            item,
          })
        } else if (result[0] === 0) {
          res.status(404).json({
            message: 'Item not found',
          })
        } else {
          res.status(500).json({
            message: 'Something went wrong',
          })
        }
      })
    }
  })

  // DELETE BY ID
  app.delete('/api/delete/:id', jwtVerify, (req, res) => {
    const { role } = req.user

    if (role !== 'admin') {
      return res.sendStatus(403)
    }

    db.Item.destroy({
      where: {
        id: req.params.id,
      },
    }).then((result) => {
      if (result === 1) {
        res.status(200).json({
          message: 'Item deleted successfully!',
        });
      } else if (result === 0) {
        res.status(404).json({
          message: 'Item not found',
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong',
        })
      }
    })
  })
}

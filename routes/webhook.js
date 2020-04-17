const jwt = require('jsonwebtoken')

const webhook = require('../webhook/webhooks.js')
const jwtSecret = require('../config/key.js')
const jwtVerify = require('./middleware/auth.js')

module.exports = (app, db) => {
  app.get('/webhook', jwtVerify, (req, res) => {
    var links = [
      {
        self: [
          {
            method: 'GET',
            href: req.url,
            rel: 'infoWebhook',
          },
        ],
        to: [
          {
            method: 'POST',
            href: req.url,
            rel: 'addWebhook',
          },
        ],
      },
    ]
    
    jwt.verify(req.token, jwtSecret.jwtSecret, (err) => {
      if (err) {
        res.status(403)
      } else {
        db.Item.findAll({}).then((result) => {
          res.status(200).json({
            result,
            links,
          })
        })
      }
    })
  })

  app.post('/webhook', jwtVerify, (req, res) => {
    var links = [
        {
          self: [
            {
                method: 'POST',
                href: req.url,
                rel: 'addWebhook',
            },
        ],
        to: [
            {
                method: 'GET',
                href: req.url,
                rel: 'infoWebhook',
            },
          ],
        },
      ]
    jwt.verify(req.token, jwtSecret.jwtSecret, (err) => {
        if (err) {
          res.status(403)
        } else {
            webhook.add('addWebhook', req.url)
            .then(() => {
                res.status(201).json({
                    message: 'Webhook added successfully',
                    links
                })
            }).catch((err) => {
                res.status(400).json({
                    message: 'Webhook failed',
                    err
                })
            })
        }
      })
  })
}

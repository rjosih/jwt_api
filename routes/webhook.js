const webhook = require('../webhook/webhooks.js')
const jwtVerify = require('../middleware/jwtVerify.js')

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

    db.Item.findAll({})
      .then((result) => {
        res.status(200).json({
          result,
          links,
        })
      }).catch(() => {
        res.status(500).json({
          message: 'Something went wrong'
        })
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
  })
}

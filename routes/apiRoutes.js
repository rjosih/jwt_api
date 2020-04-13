const jwt = require('jsonwebtoken')

const jwtSecret = require('../config/key.js')
const jwtVerify = require('./middleware/auth.js')

module.exports = (app, db) => {
    // GET ALL 
    app.get('/api/all', function (req, res) {
        console.log(jwtSecret.jwtSecret)
        db.Item.findAll({}).then(function (result) {
            if(result.length === 0){
                for(var i = 0; i < 10; i++){
                    result.push({
                     name: 'broccoli',
                     category: 'vegetables',       
                     price: 2.3
                    })
                }
            }
            res.status(200).json({
                result,
                message: 'All items have been listed successfully'
            })
        });
    });
    
    // CREATE NEW 
    app.post('/api/new', jwtVerify,  (req, res)  => {
        jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
            if(err){
                res.status(403)
            }else{
                db.Item.create({
                    name: req.body.name || 'turkey',
                    category: req.body.category || 'meat',
                    price: req.body.price || 100
                }).then(function (result) {
                    res.status(201).json({
                        result,
                        message: 'Item created successfully!'
                    })
                });
            }
        })
    });

    // UPDATE BY ID
    app.put('/api/update/:id', jwtVerify,  (req, res)  => {
        jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
            if(err){
                res.status(403)
            }else{
                db.Item.update({
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price
                }, {
                    where: {
                        id: req.params.id
                    }
                }).then(function (result) {
                    res.status(204).json({
                        result,
                        message: 'Item updated successfully!'
                    })
                });
            }
        })
    });

    // DELETE BY ID
    app.delete('/api/delete/:id', jwtVerify,  (req, res)  => {
        jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
            if(err){
                res.status(403)
            }else{
                db.Item.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(function (result) {
                    res.status(204).json({
                        result,
                        message: 1 + ' has been successfully deleted'
                    })
                });
            }
        })
    });
}
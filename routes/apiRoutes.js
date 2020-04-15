const jwt = require("jsonwebtoken");

const jwtSecret = require("../config/key.js");
const jwtVerify = require("./middleware/auth.js");

module.exports = (app, db) => {
  // GET ALL
  app.get("/api/all", (req, res) => {
    console.log(req.url);
    db.Item.findAll({}).then(function (result) {
      if (result.length === 0) {
        for (var i = 0; i < 15; i++) {
          db.Item.create({
            name: "standardturkey",
            category: "standardmeat",
            price: 400,
          });
        }
        res.status(200).json({
          message: "If you want to populate data click send again",
          result,
        });
      } else {
        res.status(200).json({
          message: "All items have been successfullt listed",
          result,
        });
      }
    });
  });

  // GET ITEM BY ID
  app.get("/api/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
      if (err) {
        res.status(403);
      } else {
        db.Item.findOne({
          where: {
            id: req.params.id,
          },
        }).then((result) => {
          if (result === null) {
            res.status(404).json({
              message: "Item not found.",
            });
          } else {
            res.status(200).json({
              message: "200 ok",
              result,
            });
          }
        });
      }
    });
  });

  // CREATE NEW
  app.post("/api/new", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
      if (err) {
        res.status(403);
      } else {
        db.Item.create({
          name: req.body.name || "turkey",
          category: req.body.category || "meat",
          price: req.body.price || 100,
        }).then((result) => {
          res.status(201).json({
            message: "Item created successfully!",
            result,
          });
        });
      }
    });
  });

  // UPDATE BY ID
  app.put("/api/update/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
      if (err) {
        res.status(403);
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
          if (result === 1) {
            res.status(204).json({
              result,
              message: "Item updated successfully!",
            });
          } else if (result === 0) {
            res.status(400).json({
              message: "Item not found",
            });
          }
        });
      }
    });
  });

  // DELETE BY ID
  app.delete("/api/delete/:id", jwtVerify, (req, res) => {
    jwt.verify(req.token, jwtSecret.jwtSecret, (err, result) => {
      if (err) {
        res.status(403);
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
            });
          }
        });
      }
    });
  });
};

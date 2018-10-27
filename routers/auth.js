const express = require('express');
const authRouter = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
authRouter.use(bodyParser.json());

authRouter.post('/register', (req, res) => {
    res.contentType('application/json');
    if (req.body.email && req.body.password) {
        db.Fleet.findById(req.body.fleetId)
            .then(query => {
                if (query) {
                    db.Manager.create(
                        {
                            email: `${req.body.email}`,
                            password: `${bcrypt.hashSync(req.body.password.toString(), 8)}`,
                            super: req.body.super,
                            fleetId: req.body.fleetId
                        }
                    ).then(() => res.json({ status: "OK" }));
                }
                else {
                    res.json({ error: 400 })
                }
            })
    }
    else {
        res.json({ status: "400" });
    }

});

authRouter.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        db.Manager.findAll({ where: { email: req.body.email } })
            .then(obj => {
                let is_auth = false;
                for (let iter of obj) {
                    if (bcrypt.compareSync(req.body.password.toString(), iter.password)) {
                        is_auth = true;
                        res.send(jwt.sign({ id: iter.id, email: iter.email }, 'test', { expiresIn: 300 }));
                        break;
                    }
                }
                if (!is_auth) {
                    res.send(400)
                }
            });
    }
    else {
        res.json('{error: 400}')
    }
});

module.exports = authRouter;
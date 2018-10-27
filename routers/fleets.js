const express = require('express');
const fleetsRouter = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/db');
fleetsRouter.use(bodyParser.json());

fleetsRouter.get('/readall', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Fleet.findAll()
            .then(query => res.json(query));
    }
    else {
        res.json({ status: 403 });
    }
});

fleetsRouter.get('/read', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Fleet.findById(req.query.id)
            .then(query => query ? res.json(query) : res.json({ error: 400 }));
    }
    else {
        db.Fleet.findById(req.manager.fleetId)
            .then(query => query ? res.json(query) : res.json({ error: 400 }));
    }
});

fleetsRouter.post('/create', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Fleet.create
        (
            {
                name: req.body.name
            }
        ).then((fleet) => res.json(fleet));
    }
    else {
        res.json({ status: 403 });
    }
});

fleetsRouter.post('/update', (req, res) => {
    if (req.manager.super) {

        res.contentType('application/json');
        db.Fleet.update({ name: req.body.name }, { where: { id: req.body.id } })
            .then((fleet) => db.fleets.findById(req.body.id).then(
                query => query ? res.json(query) : res.json('{error: 400}')))
    }
    else {
        res.json({ status: 403 });
    }
});

fleetsRouter.post('/delete', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Fleet.findById(req.body.id)
            .then(fleet => db.fleets.destroy({ where: { id: req.body.id } })
                .then(query => query ? res.json(fleet) : res.json('{error: 400}')));
    }
    else {
        res.json({ status: 403 });
    }
});

module.exports = fleetsRouter;
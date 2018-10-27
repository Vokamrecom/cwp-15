const express = require('express');
const motionsRouter = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/db');
motionsRouter.use(bodyParser.json());

motionsRouter.post('/create', (req, res) => {
    res.contentType('application/json');
    if (!req.body.latitude) res.json({ error: 400 });
    if (!req.body.longitude) res.json({ error: 400 });
    if (!req.body.time) res.json({ error: 400 });
    if (!req.body.vehicleId) {
        res.json({ error: 400 })
    }
    else {
        if (req.manager.super) {
            db.Vehicle.findById(req.body.vehicleId)
                .then((vehicle) => {
                    if (!vehicle) {
                        res.json({ error: 400 });
                    }
                    else {
                        db.Motion.create
                        (
                            {
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                                time: req.body.time,
                                vehicleId: req.body.vehicleId
                            }
                        ).then((motion) => res.json(motion));
                    }
                })
        }
        else {
            db.Vehicle.findAll({ where: { id: req.body.vehicleId, fleetId: req.manager.fleetId } })
                .then(query => {
                    if (query.length) {
                        db.Motion.create
                        (
                            {
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                                time: req.body.time,
                                vehicleId: req.body.vehicleId
                            }
                        ).then((motion) => res.json(motion));
                    }
                    else {
                        res.json('{error: 400}');
                    }
                });
        }
    }
});

module.exports = motionsRouter;
const express = require('express');
const vehiclesRouter = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/db');
const geolib = require('geolib');
vehiclesRouter.use(bodyParser.json());

vehiclesRouter.get('/readall', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Vehicle.findAll()
            .then(query => res.json(query));
    }
    else {
        db.Vehicle.findAll({ where: { fleetId: req.manager.fleetId } })
            .then(result => {
                res.json(result)
            })
    }
});

vehiclesRouter.get('/read', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Vehicle.findById(req.query.id)
            .then(query => query ? res.json(query) : res.json({ error: 400 }));
    }
    else {
        db.Vehicle.findAll({ where: { id: req.query.id, fleetId: req.manager.fleetId } })
            .then(query => {
                if (query) {
                    res.json(query[0])
                }
                else {
                    res.json({ error: 400 });
                }
            })
            .catch(query => res.json({ error: 400 }));
    }
});

vehiclesRouter.post('/create', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        if (!req.body.name) res.json({ error: 400 });
        if (req.body.fleetId) {
            db.Fleet.findById(req.body.fleetId)
                .then(fleet => {
                    if (!fleet) res.json({ error: 400 });
                    db.Vehicle.create
                    (
                        {
                            name: req.body.name,
                            fleetId: req.body.fleetId
                        }
                    ).then((vehicle) => res.json(vehicle));
                })
        }

    }
    else {
        if (!req.body.name) res.json({ error: 400 });
        else {
            db.Fleet.findById(req.manager.fleetId)
                .then(fleet => {
                    if (!fleet) res.json({ error: 400 });
                    db.Vehicle.create
                    (
                        {
                            name: req.body.name,
                            fleetId: req.manager.fleetId
                        }
                    ).then((vehicle) => res.json(vehicle));
                })
        }
    }

});

vehiclesRouter.post('/update', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Vehicle.update(
            {
                name: req.body.name,
                fleetId: req.body.fleetId
            }, { where: { id: req.body.id } })
            .then((vehicle) => db.Vehicle.findById(req.body.id).then(query => query ? res.json(query) : res.json('{error: 400}')))
    }
    else {
        db.Vehicle.findAll({ where: { id: req.body.id, fleetId: req.manager.fleetId } })
            .then(query => {
                if (query.length) {
                    db.Vehicle.update(
                        {
                            name: req.body.name,
                            fleetId: req.body.fleetId
                        }, { where: { id: req.body.id } })
                        .then((vehicle) => db.Vehicle.findById(req.body.id).then(query => query ? res.json(query) : res.json('{error: 400}')))
                }
                else {
                    res.json('{error: 400}')
                }
            });
    }
    res.contentType('application/json');
});

vehiclesRouter.post('/delete', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {

        db.Vehicle.findById(req.body.id)
            .then(vehicle => db.Vehicle.destroy({ where: { id: req.body.id } })
                .then(query => query ? res.json(vehicle) : res.json('{error: 400}')));
    }
    else {
        db.Vehicle.findAll({ where: { id: req.body.id, fleetId: req.manager.fleetId } })
            .then(query => {
                if (query.length) {
                    db.Vehicle.destroy({ where: { id: req.body.id } })
                        .then(query => query ? res.json(vehicle) : res.json('{error: 400}'));
                }
                else {
                    res.json('{error: 400}');
                }
            });
    }

});

vehiclesRouter.post('/milage', (req, res) => {
    res.contentType('application/json');
    if (req.manager.super) {
        db.Motion.findAll({ where: { vehicleId: req.body.vehicleId } })
            .then(motions => {
                let milage = 0;
                if (!motions.length) {
                    res.json({ error: 400 });
                }

                for (let iter = 1; iter < motions.length; iter++) {
                    console.log(motions[iter].latLng);
                    milage += geolib.getDistance
                    (
                        motions[iter].latLng,
                        motions[iter - 1].latLng
                    );
                }
                res.json({ motion: milage });
            })
    }
    else {
        db.Vehicle.findAll({ where: { id: req.body.vehicleId, fleetId: req.manager.fleetId } })
            .then(query => {
                if (query.length) {
                    db.Motion.findAll({ where: { vehicleId: req.body.vehicleId } })
                        .then(motions => {
                            let milage = 0;
                            if (!motions.length) {
                                res.json({ error: 400 });
                            }

                            for (let iter = 1; iter < motions.length; iter++) {
                                console.log(motions[iter].latLng);
                                milage += geolib.getDistance
                                (
                                    motions[iter].latLng,
                                    motions[iter - 1].latLng
                                );
                            }
                            res.json({ motion: milage });
                        })
                }
                else {
                    res.json('{error: 400}');
                }
            });
    }
});

module.exports = vehiclesRouter;
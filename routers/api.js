const express = require('express');
const APIRouter = express.Router();
const fleetsRouter = require('./fleets');
const vehiclesRouter = require('./vehicles');
const motionsRouter = require('./motions');
const authRouter = require('./auth');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
APIRouter.use(bodyParser.urlencoded({extended: true}));

APIRouter.all(/\/motions|\/fleets|\/vehicles/, function (req, res, next) {
    if(req.header("Authorization"))
    {
        let auth = req.header("Authorization").split(" ")[1];
        jwt.verify(auth, 'test', (err, decoded)=>
        {
            if(err)
            {
                res.send(403);
            }
            else
            {
                db.Manager.findById(decoded.id)
                    .then
                    (query=> { query? req.manager=query: res.send(403); next();});
            }
        });
    }
    else
    {
        res.send(401);
    }
});

APIRouter.use('/fleets', fleetsRouter);
APIRouter.use('/vehicles', vehiclesRouter);
APIRouter.use('/motions', motionsRouter);
APIRouter.use('/auth', authRouter)

module.exports = APIRouter;
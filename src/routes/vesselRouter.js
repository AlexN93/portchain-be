const express = require('express'),
    app = express();
import { cache } from '../cache/memCache'
import vesselService from '../services/vesselService';

app.get('/', cache(600), async (req, res, next) => {
    try {
        const { limit, sortKey, sortDir, delayPerc, delayDays } = req.query;

        const data = vesselService.findAll(sortKey, sortDir, +limit, delayDays, delayPerc);

        res.status(200).send(data);
    } catch (e) {
        next(e);
    }
});

module.exports = app;

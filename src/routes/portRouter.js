const express = require('express'),
    app = express();
import { cache } from '../cache/memCache'
import portService from '../services/portService';

app.get('/', cache(600), async (req, res, next) => {
    try {
        const { limit, sortKey, sortDir, durationPerc } = req.query;

        const data = portService.findAll(sortKey, sortDir, +limit, durationPerc);

        res.status(200).send(data);
    } catch (e) {
        next(e);
    }
});

module.exports = app;
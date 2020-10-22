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

app.get('/:portId', cache(600), async (req, res, next) => {
    try {
        const id = req.params['portId'].trim();
        const { durationPerc } = req.query;

        const port = portService.findOne(id, durationPerc);

        if (!port) res.status(404).end();

        res.status(200).send(port);
    } catch (e) {
        next(e);
    }
});

app.get('/:portId/schedule/', cache(600), async (req, res, next) => {
    try {
        const id = req.params['portId'].trim();

        const schedule = portService.findOneWithSchedule(id);

        if (!schedule) res.status(404).end();

        res.status(200).send(schedule);
    } catch (e) {
        next(e);
    }
});

module.exports = app;
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

app.get('/:vesselId', cache(600), async (req, res, next) => {
    try {
        const id = req.params['vesselId'].trim();
        const { delayDays, delayPerc } = req.query;

        const schedule = vesselService.findOne(+id, delayDays, delayPerc);

        if (!schedule) res.status(404).end();

        res.status(200).send(schedule);
    } catch (e) {
        next(e);
    }
});

app.get('/:vesselId/schedule/', cache(600), async (req, res, next) => {
    try {
        const id = req.params['vesselId'].trim();

        const schedule = vesselService.findOneWithSchedule(+id);

        if (!schedule) res.status(404).end();

        res.status(200).send(schedule);
    } catch (e) {
        next(e);
    }
});

module.exports = app;

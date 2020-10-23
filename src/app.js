import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import { loadData } from './cache/memCache';
require('./nativeUtils');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

import portRouter from './routes/portRouter';
import vesselRouter from './routes/vesselRouter';

const initialize = new Promise((resolve, reject) => {
    loadData()
        .then(() => resolve())
        .catch(e => reject(e));
});

app.use(async (req, res, next) => {
    await initialize;
    next();
});

app.use('/api/ports', portRouter);
app.use('/api/vessels', vesselRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

export default app;

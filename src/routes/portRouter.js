const express = require('express'),
    app = express();
import { cache } from '../cache/memCache'
import portService from '../services/portService';

/**
 * @api {get} /api/ports/ Get Ports
 * @apiVersion 1.0.0
 * @apiName getPorts
 * @apiGroup Ports
 *
 * @apiParam {String} limit limit of records
 * @apiParam {String} sortKey key by which to sort
 * @apiParam {String} sortDir sort by asc/desc
 * @apiParam {String} durationPerc duration percentages
 *
 * @apiSuccess {statusCode} status code
 * @apiSuccess {array} array of objects containing queried records
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "statusCode": 200,
 *         [{
 *	            "id": "DEHAM",
 *	            "name": "Hamburg",
 *	            "portCalls": 23,
 *	            "portCallDurations": {
 *	                "hours": [11.2, 12.08, 12.7, 13.7, 13.8, 14.3, 14.4, 16.4, 18.7, 20.6, 22, 22.5, 22.6, 25.85, 30.4, 31.1, 37, 41.5, 42, 43, 56, 76.1, 87.9],
 *	                "percentiles": [{
 *	                    "percentile": 0,
 *	                    "value": 11.2
 *	                }, {
 *	                    "percentile": 5,
 *	                    "value": 11.38
 *	                }, {
 *	                    "percentile": 10,
 *	                    "value": 12.33
 *	                }, {
 *	                    "percentile": 15,
 *	                    "value": 13.3
 *	                }, {
 *	                    "percentile": 20,
 *	                    "value": 13.78
 *	                }, {
 *	                    "percentile": 25,
 *	                    "value": 14.3
 *	                }, {
 *	                    "percentile": 30,
 *	                    "value": 14.8
 *	                }, {
 *	                    "percentile": 35,
 *	                    "value": 17.32
 *	                }, {
 *	                    "percentile": 40,
 *	                    "value": 19.84
 *	                }, {
 *	                    "percentile": 45,
 *	                    "value": 21.72
 *	                }, {
 *	                    "percentile": 50,
 *	                    "value": 22.5
 *	                }, {
 *	                    "percentile": 55,
 *	                    "value": 23.25
 *	                }, {
 *	                    "percentile": 60,
 *	                    "value": 27.67
 *	                }, {
 *	                    "percentile": 65,
 *	                    "value": 30.82
 *	                }, {
 *	                    "percentile": 70,
 *	                    "value": 35.82
 *	                }, {
 *	                    "percentile": 75,
 *	                    "value": 41.5
 *	                }, {
 *	                    "percentile": 80,
 *	                    "value": 42.2
 *	                }, {
 *	                    "percentile": 85,
 *	                    "value": 48.2
 *	                }, {
 *	                    "percentile": 90,
 *	                    "value": 68.06
 *	                }, {
 *	                    "percentile": 95,
 *	                    "value": 85.54
 *	                }, {
 *	                    "percentile": 100,
 *	                    "value": 87.9
 *	                }]
 *	            }
 *         }..]
*/
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
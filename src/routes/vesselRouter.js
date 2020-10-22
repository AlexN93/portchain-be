const express = require('express'),
    app = express();
import { cache } from '../cache/memCache'
import vesselService from '../services/vesselService';

/**
 * @api {get} /api/vessels/ Get Vessels
 * @apiVersion 1.0.0
 * @apiName getVessels
 * @apiGroup Vessels
 *
 * @apiParam {String} limit limit of records
 * @apiParam {String} sortKey key by which to sort
 * @apiParam {String} sortDir sort by asc/desc
 * @apiParam {String} delayPerc delay percentages
 * @apiParam {String} delayDays days of arrival
 *
 * @apiSuccess {statusCode} status code
 * @apiSuccess {array} array of objects containing queried records
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "statusCode": 200,
 *         [{
 *	            "imo": 9387425,
 *	            "name": "EMPIRE",
 *	            "portCalls": 52,
 *	            "portCallDelays": [{
 *	                "days": 2,
 *	                "percentiles": [{
 *	                    "percentile": 0,
 *	                    "value": 0
 *	                }, {
 *	                    "percentile": 5,
 *	                    "value": 0.43
 *	                }, {
 *	                    "percentile": 10,
 *	                    "value": 0.7
 *	                }, {
 *	                    "percentile": 15,
 *	                    "value": 0.8
 *	                }, {
 *	                    "percentile": 20,
 *	                    "value": 1.1
 *	                }, {
 *	                    "percentile": 25,
 *	                    "value": 1.53
 *	                }, {
 *	                    "percentile": 30,
 *	                    "value": 1.89
 *	                }, {
 *	                    "percentile": 35,
 *	                    "value": 2.77
 *	                }, {
 *	                    "percentile": 40,
 *	                    "value": 3.48
 *	                }, {
 *	                    "percentile": 45,
 *	                    "value": 5.36
 *	                }, {
 *	                    "percentile": 50,
 *	                    "value": 5.7
 *	                }, {
 *	                    "percentile": 55,
 *	                    "value": 7.37
 *	                }, {
 *	                    "percentile": 60,
 *	                    "value": 10.2
 *	                }, {
 *	                    "percentile": 65,
 *	                    "value": 11.23
 *	                }, {
 *	                    "percentile": 70,
 *	                    "value": 12.32
 *	                }, {
 *	                    "percentile": 75,
 *	                    "value": 12.67
 *	                }, {
 *	                    "percentile": 80,
 *	                    "value": 13.08
 *	                }, {
 *	                    "percentile": 85,
 *	                    "value": 15.01
 *	                }, {
 *	                    "percentile": 90,
 *	                    "value": 17.64
 *	                }, {
 *	                    "percentile": 95,
 *	                    "value": 24.14
 *	                }, {
 *	                    "percentile": 100,
 *	                    "value": 27.1
 *	                }]
 *	            }...],
 *         }...]
 *     }
*/
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

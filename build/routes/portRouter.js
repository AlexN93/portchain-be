"use strict";

var _portService = _interopRequireDefault(require("../services/portService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require('express'),
      app = express();

/* GET a list of ports with related information.
     * @param (optional) req.query.limit        {Number}  The number of records to return
     * @param (optional) req.query.sortKey      {String}  The property on which to sort
     * @param (optional) req.query.sortDir      {String}  The sort direction ('asc' or 'dsc')
     * @param (optional) req.query.durationPerc {Array}   An array of port call duration percentiles
     * */
app.get('/', async (req, res, next) => {
  try {
    const {
      limit,
      sortKey,
      sortDir,
      durationPerc
    } = req.query;

    const data = _portService.default.findAll(sortKey, sortDir, +limit, durationPerc);

    res.status(200).send(data);
  } catch (e) {
    next(e);
  }
});
/* GET basic information about a specific port.
 * @param (optional) req.query.durationPerc   {Array}   An array of port call duration percentiles
 * */

app.get('/:portId', async (req, res, next) => {
  try {
    const id = req.params['portId'].trim();
    const {
      durationPerc
    } = req.query;

    const port = _portService.default.findOne(id, durationPerc);

    if (!port) res.status(404).end();
    res.status(200).send(port);
  } catch (e) {
    next(e);
  }
});
/* GET the full schedule for a specific port.
 * @param req.params.portId   {String}  The id of the port
 * */

app.get('/:portId/schedule/', async (req, res, next) => {
  try {
    const id = req.params['portId'].trim();

    const schedule = _portService.default.findOneWithSchedule(id);

    if (!schedule) res.status(404).end();
    res.status(200).send(schedule);
  } catch (e) {
    next(e);
  }
});
module.exports = app;
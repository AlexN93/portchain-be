"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memCache = require("../cache/memCache");

var _utils = _interopRequireDefault(require("../utils"));

var _Vessel = require("../models/Vessel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  round
} = require('lodash');

function findOne(vesselId, forecastPoints, percentilePoints) {
  if (forecastPoints) forecastPoints = _utils.default.sanitizeNumbers(forecastPoints);
  if (percentilePoints) percentilePoints = _utils.default.sanitizeNumbers(percentilePoints);
  const schedule = cachedSchedules().find(schedule => schedule.vessel.imo === vesselId);
  if (!schedule) return;
  return _vesselStats(schedule, forecastPoints, percentilePoints);
}

function findOneWithSchedule(vesselId) {
  const schedule = cachedSchedules().find(schedule => schedule.vessel.imo === vesselId);
  if (!schedule) return;
  return new _Vessel.Vessel({
    imo: schedule.vessel.imo,
    name: schedule.vessel.name,
    portCalls: schedule.portCalls
  });
}

function findAll(sortKey, sortDir, limit, forecastPoints, percentilePoints) {
  if (forecastPoints) forecastPoints = _utils.default.sanitizeNumbers(forecastPoints);
  if (percentilePoints) percentilePoints = _utils.default.sanitizeNumbers(percentilePoints);
  const vessels = cachedSchedules().map(s => _vesselStats(s, forecastPoints, percentilePoints));
  vessels.sortAndLimit(_utils.default.sanitizeStrings(sortKey), sortDir, limit);
  return vessels;
}

function _vesselStats(schedule, forecastPoints, percentilePoints) {
  return { ...schedule.vessel,
    portCalls: schedule.portCalls.filter(portCall => !portCall.isOmitted).length,
    ...(forecastPoints && percentilePoints && {
      portCallDelays: _vesselDelays(schedule.portCalls.filter(portCall => !portCall.isOmitted), forecastPoints, percentilePoints)
    })
  };
}

function _vesselDelays(portCalls, forecastPoints, percentilePoints) {
  const portCallDelays = [];
  portCalls.forEach(portCall => {
    const actualArrival = portCall.arrival;
    const forecastArrivals = portCall.logEntries.filter(entry => entry.updatedField === 'arrival');
    const delays = forecastPoints.reduce((obj, key) => ({ ...obj,
      [key]: 0
    }), {});
    forecastArrivals.forEach(forecast => {
      let forecastPoint = _utils.default.hoursBetween(forecast.createdDate, actualArrival, false) / 24;
      let forecastDelay = round(_utils.default.hoursBetween(forecast.arrival, actualArrival, true), 2);
      updateDelays(forecastPoint, forecastDelay);
    });

    function updateDelays(point, delay, n = 0) {
      if (forecastPoints.length <= n || point <= forecastPoints[n]) return;
      delays[forecastPoints[n]] = delay;
      updateDelays(point, delay, n + 1);
    }

    portCallDelays.push(delays);
  });
  const delayPercentiles = [];
  forecastPoints.forEach(forecastPoint => delayPercentiles.push({
    days: forecastPoint,
    percentiles: _utils.default.percentiles(portCallDelays.map(delays => delays[forecastPoint]).sort((a, b) => a - b), percentilePoints)
  }));
  return delayPercentiles;
}

const cachedSchedules = () => _memCache.memCache.get('schedules');

var _default = {
  findAll,
  findOne,
  findOneWithSchedule
};
exports.default = _default;
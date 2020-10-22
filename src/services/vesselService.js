const { round } = require('lodash');
import { memCache } from '../cache/memCache';
import utils from '../utils';
import { Vessel } from '../models/Vessel';

function findOne(vesselId, forecastPoints, percentilePoints) {
    if (forecastPoints) forecastPoints = utils.sanitizeNumbers(forecastPoints);
    if (percentilePoints) percentilePoints = utils.sanitizeNumbers(percentilePoints);

    const schedule = cachedSchedules().find(schedule => schedule.vessel.imo === vesselId);

    if (!schedule) return;

    return _vesselStats(schedule, forecastPoints, percentilePoints);
}

function findOneWithSchedule(vesselId) {
    const schedule = cachedSchedules().find(schedule => schedule.vessel.imo === vesselId);

    if (!schedule) return;

    return new Vessel({
        imo: schedule.vessel.imo,
        name: schedule.vessel.name,
        portCalls: schedule.portCalls,
    });
}

function findAll(sortKey, sortDir, limit, forecastPoints, percentilePoints) {
    if (forecastPoints) forecastPoints = utils.sanitizeNumbers(forecastPoints);
    if (percentilePoints) percentilePoints = utils.sanitizeNumbers(percentilePoints);

    const vessels = cachedSchedules().map(s => _vesselStats(s, forecastPoints, percentilePoints));

    vessels.sortAndLimit(utils.sanitizeStrings(sortKey), sortDir, limit);

    return vessels;
}

function _vesselStats(schedule, forecastPoints, percentilePoints) {
    return {
        ...schedule.vessel,
        portCalls: schedule.portCalls.filter(portCall => !portCall.isOmitted).length,
        ...(forecastPoints &&
            percentilePoints && {
                portCallDelays: _vesselDelays(
                    schedule.portCalls.filter(portCall => !portCall.isOmitted),
                    forecastPoints,
                    percentilePoints
                ),
            }),
    };
}

function _vesselDelays(portCalls, forecastPoints, percentilePoints) {
    const portCallDelays = [];

    portCalls.forEach(portCall => {
        const actualArrival = portCall.arrival;
        const forecastArrivals = portCall.logEntries.filter(entry => entry.updatedField === 'arrival');

        const delays = forecastPoints.reduce((obj, key) => ({ ...obj, [key]: 0 }), {});

        forecastArrivals.forEach(forecast => {
            let forecastPoint = utils.hoursBetween(forecast.createdDate, actualArrival, false) / 24;
            let forecastDelay = round(utils.hoursBetween(forecast.arrival, actualArrival, true), 2);
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

    forecastPoints.forEach(forecastPoint =>
        delayPercentiles.push({
            days: forecastPoint,
            percentiles: utils.percentiles(
                portCallDelays.map(delays => delays[forecastPoint]).sort((a, b) => a - b),
                percentilePoints
            ),
        })
    );

    return delayPercentiles;
}

const cachedSchedules = () => memCache.get('schedules');

export default { findAll, findOne, findOneWithSchedule };

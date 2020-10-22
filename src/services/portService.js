const { round } = require('lodash');
import { memCache } from '../cache/memCache';
import utils from '../utils';
import { PortCall } from '../models/PortCall';

function findAll(sortKey, sortDir, limit, percentilePoints) {
    percentilePoints = utils.sanitizeNumbers(percentilePoints);

    const ports = portsWithStats(percentilePoints);

    ports.sortAndLimit(utils.sanitizeStrings(sortKey), sortDir, limit);

    return ports;
}

function portsWithStats(durationPercentiles) {
    const cachedCalls = memCache.get('schedules').flatMap(schedule => schedule.portCalls);
    const ports = cachedCalls.reduce((ports, portCall) => {
        const { port, arrival, departure, isOmitted } = new PortCall(portCall);
        const portCallDuration = durationPercentiles && round(utils.hoursBetween(arrival, departure), 2);

        const existingIndex = ports.findIndex(p => p.id === port.id);

        if (existingIndex === -1) {
            ports.push({
                id: port.id,
                name: port.name,
                portCalls: isOmitted ? 0 : 1,
                ...(durationPercentiles && {
                    portCallDurations: {
                        hours: isOmitted ? [] : [portCallDuration],
                    },
                }),
            });
        } else if (!isOmitted) {
            ports[existingIndex].portCalls++;
            if (durationPercentiles) {
                ports[existingIndex].portCallDurations.hours.pushSorted(portCallDuration, (a, b) => a - b);
            }
        }

        return ports;
    }, []);

    if (durationPercentiles) {
        ports.forEach(
            p =>
                (p.portCallDurations.percentiles = utils.percentiles(
                    p.portCallDurations.hours,
                    durationPercentiles
                ))
        );
    }

    return ports;
}

export default { findAll };

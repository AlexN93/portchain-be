"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memCache = require("../cache/memCache");

var _utils = _interopRequireDefault(require("../utils"));

var _PortCall = require("../models/PortCall");

var _Port = require("../models/Port");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  round
} = require('lodash');

function findOne(portId, percentilePoints) {
  percentilePoints = _utils.default.sanitizeNumbers(percentilePoints);
  return portsWithStats(percentilePoints).find(port => port.id === portId);
}

function findOneWithSchedule(portId) {
  const portCalls = cachedCalls().filter(portCall => new _PortCall.PortCall(portCall).port.id === portId);
  if (!portCalls) return;
  return new _Port.Port({
    id: portId,
    name: portCalls[0].port.name,
    portCalls: portCalls.map(({
      port,
      ...fieldsToKeep
    }) => fieldsToKeep)
  });
}

function findAll(sortKey, sortDir, limit, percentilePoints) {
  percentilePoints = _utils.default.sanitizeNumbers(percentilePoints);
  const ports = portsWithStats(percentilePoints); // TODO - fix me

  ports.sortAndLimit(_utils.default.sanitizeStrings(sortKey), sortDir, limit);
  return ports;
}

function portsWithStats(durationPercentiles) {
  const ports = cachedCalls().reduce((ports, portCall) => {
    const {
      port,
      arrival,
      departure,
      isOmitted
    } = new _PortCall.PortCall(portCall);
    const portCallDuration = durationPercentiles && round(_utils.default.hoursBetween(arrival, departure), 2);
    const existingIndex = ports.findIndex(p => p.id === port.id);

    if (existingIndex === -1) {
      ports.push({
        id: port.id,
        name: port.name,
        portCalls: isOmitted ? 0 : 1,
        ...(durationPercentiles && {
          portCallDurations: {
            hours: isOmitted ? [] : [portCallDuration]
          }
        })
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
    ports.forEach(p => p.portCallDurations.percentiles = _utils.default.percentiles(p.portCallDurations.hours, durationPercentiles));
  }

  return ports;
}

const cachedCalls = () => _memCache.memCache.get('schedules').flatMap(schedule => schedule.portCalls);

var _default = {
  findOne,
  findAll,
  findOneWithSchedule
};
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schedule = void 0;

var _PortCall = require("./PortCall");

var _Vessel = require("./Vessel");

class Schedule {
  constructor({
    vessel,
    portCalls = []
  }) {
    this.vessel = new _Vessel.Vessel(vessel);
    this.portCalls = portCalls.map(portCall => new _PortCall.PortCall(portCall));
  }

}

exports.Schedule = Schedule;
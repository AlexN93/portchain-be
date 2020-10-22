"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortCall = void 0;

var _PortCallRecord = require("./PortCallRecord");

var _Port = require("./Port");

var _LogEntry = require("./LogEntry");

class PortCall extends _PortCallRecord.PortCallRecord {
  constructor(portCall) {
    super(portCall);
    this.service = portCall.service;
    this.port = new _Port.Port(portCall.port);
    this.logEntries = portCall.logEntries !== null ? portCall.logEntries.map(logEntry => new _LogEntry.LogEntry(logEntry)) : [];
  }

}

exports.PortCall = PortCall;
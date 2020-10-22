"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogEntry = void 0;

var _PortCallRecord = require("./PortCallRecord");

class LogEntry extends _PortCallRecord.PortCallRecord {
  constructor(logEntry) {
    super(logEntry);
    this.updatedField = logEntry.updatedField;
  }

}

exports.LogEntry = LogEntry;
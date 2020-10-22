"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortCallRecord = void 0;

class PortCallRecord {
  constructor({
    arrival = null,
    departure = null,
    createdDate = null,
    isOmitted
  }) {
    this.arrival = new Date(arrival);
    this.departure = new Date(departure);
    this.createdDate = new Date(createdDate);
    this.isOmitted = isOmitted;
  }

}

exports.PortCallRecord = PortCallRecord;
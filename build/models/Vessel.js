"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vessel = void 0;

class Vessel {
  constructor({
    imo,
    name,
    portCalls
  }) {
    this.imo = imo;
    this.name = name;
    this.portCalls = portCalls;
  }

}

exports.Vessel = Vessel;
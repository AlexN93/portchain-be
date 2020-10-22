"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Port = void 0;

class Port {
  constructor({
    id,
    name,
    portCalls
  }) {
    this.id = id;
    this.name = name;
    this.portCalls = portCalls;
  }

}

exports.Port = Port;
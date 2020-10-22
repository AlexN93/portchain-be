import { PortCallRecord } from './PortCallRecord';
import { Port } from './Port';
import { LogEntry } from './LogEntry';

export class PortCall extends PortCallRecord {
  constructor(portCall) {
    super(portCall);
    this.service = portCall.service;
    this.port = new Port(portCall.port);
    this.logEntries =
      portCall.logEntries !== null
        ? portCall.logEntries.map(logEntry => new LogEntry(logEntry))
        : [];
  }
}

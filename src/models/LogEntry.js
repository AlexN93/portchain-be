import { PortCallRecord } from './PortCallRecord';

export class LogEntry extends PortCallRecord {
  constructor(logEntry) {
    super(logEntry);
    this.updatedField = logEntry.updatedField;
  }
}
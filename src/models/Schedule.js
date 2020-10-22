import { PortCall } from './PortCall';
import { Vessel } from './Vessel';

export class Schedule {
  constructor({ vessel, portCalls = [] }) {
    this.vessel = new Vessel(vessel);
    this.portCalls = portCalls.map(portCall => new PortCall(portCall));
  }
}

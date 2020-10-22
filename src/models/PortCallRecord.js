export class PortCallRecord {
  constructor({ arrival = null, departure = null, createdDate = null, isOmitted }) {
    this.arrival = new Date(arrival);
    this.departure = new Date(departure);
    this.createdDate = new Date(createdDate);
    this.isOmitted = isOmitted;
  }
}

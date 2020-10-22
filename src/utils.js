const { round } = require('lodash');

function sanitizeStrings(strArray) {
    if (strArray === null || typeof strArray !== 'string') return strArray;

    return strArray
        .split(',')
        .map(value => value.trim())
        .filter((value, index, self) => self.indexOf(value) === index && value !== '');
}

function sanitizeNumbers(numArray) {
    if (numArray === null || typeof numArray !== 'string') return numArray;

    return numArray
        .split(',')
        .map(value => (value.trim() ? Number(value.trim()) : -1))
        .filter(value => !Number.isNaN(value) && value >= 0 && value <= 100)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a - b);
}

function hoursBetween(dateFrom, dateTo, absoluteValue = false) {
    if (Object.prototype.toString.call(dateFrom) !== '[object Date]')
        throw new TypeError('`dateFrom` must be a date object');

    if (Object.prototype.toString.call(dateTo) !== '[object Date]')
        throw new TypeError('`dateTo` must be a date object');

    let timeDifference = dateTo.getTime() - dateFrom.getTime();
    if (absoluteValue) timeDifference = Math.abs(timeDifference);
    return timeDifference / (1000 * 3600);
}

function percentiles(values, percentilePoints) {
    if (!Array.isArray(values)) throw new TypeError('`values` must be an array');

    if (!Array.isArray(percentilePoints) || percentilePoints.length === 0)
        throw new TypeError('`percentilePoints` must be a non-empty array');

    return percentilePoints.map(percentilePoint => calculatePercentile(values, percentilePoint));
}

function calculatePercentile(values, percentile) {
    if (!values || values.length === 0) return {percentile, value: 0};
    if (typeof percentile !== 'number') throw new TypeError('`percentile` must be a number');

    let rank = (percentile / 100) * (values.length + 1);

    if (rank > values.length) return {percentile, value: values[values.length - 1]};
    if (rank < 1) return {percentile, value: values[0]};
    if (Number.isInteger(rank)) return {percentile, value: values[rank - 1]};

    const ir = Math.trunc(rank);
    const fr = rank - ir;

    return {percentile, value: round((fr * (values[ir] - values[ir - 1]) + values[ir - 1]), 2)};
}

function pushSorted (value, comparator) {
    let idx = insertionIndex(this, value, comparator);
    this.splice(idx, 0, value);
    return this.length;

    function insertionIndex(array, value, comparator) {
        let low = 0;
        let high = array.length;
        let mid = -1;
        let c = 0;

        while (low < high) {
            mid = (low + high) >>> 1;
            c = comparator(array[mid], value);
            if (c < 0) low = mid + 1;
            else if (c > 0) high = mid;
            else return mid;
        }

        return low;
    }
}

export default { hoursBetween, percentiles, sanitizeNumbers, sanitizeStrings, pushSorted };

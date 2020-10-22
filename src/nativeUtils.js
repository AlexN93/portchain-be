Array.prototype.pushSorted = function (value, comparatorFn) {
    let idx = insertionIndex(this, value, comparatorFn);
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
};

Object.prototype.getNestedProperty = function (propertyName) {
    let obj = this;
    for (const prop of propertyName.split('.')) {
        obj = obj[prop];
    }
    return obj;
};

Array.prototype.sortAndLimit = function (sortKeys, sortDir, limit) {
    if (sortKeys) {
        this.sort((o1, o2) => {
            for (let key of sortKeys) {
                const sorted = sortByKey(o1, o2, key.trim());
                if (sorted !== 0) return sorted;
            }
            return Math.random() >= 0.5 ? 1 : -1;
        });
    }

    function sortByKey(o1, o2, key) {
        if (o1.getNestedProperty(key) < o2.getNestedProperty(key)) return sortDir === 'desc' ? 1 : -1;
        if (o1.getNestedProperty(key) > o2.getNestedProperty(key)) return sortDir === 'desc' ? -1 : 1;
        return 0;
    }

    if (Number.isInteger(limit) && limit > 0 && limit <= this.length) {
        this.splice(limit);
    }
};
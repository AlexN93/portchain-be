import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';

require('../src/nativeUtils');

describe('nativeUtils', () => {
    describe('Array.prototype.pushSorted', () => {
        const array = [];
        const comparator = (a, b) => a - b;

        it('should push elements in an array in sorted order based on provided comparator', () => {
            array.pushSorted(2, comparator);
            array.pushSorted(3, comparator);
            array.pushSorted(1, comparator);
            array.pushSorted(6, comparator);
            array.pushSorted(4, comparator);
            array.pushSorted(5, comparator);

            expect(array).to.deep.equal([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('Array.prototype.sortAndLimit', () => {
        let array;

        beforeEach(() => {
            array = [
                { expectedOrder: 8, sortProp1: 150, sortProp2: 0 },
                { expectedOrder: 6, sortProp1: 82, sortProp2: 0 },
                { expectedOrder: 7, sortProp1: 94, sortProp2: 0 },
                { expectedOrder: 2, sortProp1: 12, sortProp2: 1 },
                { expectedOrder: 4, sortProp1: 12, sortProp2: 3 },
                { expectedOrder: 5, sortProp1: 34, sortProp2: 0 },
                { expectedOrder: 3, sortProp1: 12, sortProp2: 2 },
                { expectedOrder: 1, sortProp1: 8, sortProp2: 0 },
            ];
        });

        it('should sort an array of objects by an array of keys in ascending order', () => {
            array.sortAndLimit(['sortProp1', 'sortProp2'], 'asc');
            expect(array.map(o => o.expectedOrder)).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('should sort an array of objects by an array of keys in descending order', () => {
            array.sortAndLimit(['sortProp1', 'sortProp2'], 'desc');
            expect(array.map(o => o.expectedOrder)).to.deep.equal([8, 7, 6, 5, 4, 3, 2, 1]);
        });

        it('should sort and slice an array of objects in ascending order', () => {
            array.sortAndLimit(['sortProp1', 'sortProp2'], 'asc', 5);
            expect(array.map(o => o.expectedOrder)).to.deep.equal([1, 2, 3, 4, 5]);
        });

        it('should sort and slice an array of objects in descending order', () => {
            array.sortAndLimit(['sortProp1', 'sortProp2'], 'desc', 5);
            expect(array.map(o => o.expectedOrder)).to.deep.equal([8, 7, 6, 5, 4]);
        });
    });

    describe('Object.prototype.getNestedProperty', () => {
        const value = 'nested property value';
        const object = {
            level0: {
                level1: {
                    level2: {
                        level3: value,
                    },
                },
            },
        };

        it('should return the value of a nested property', () => {
            const nestedProperty = object.getNestedProperty('level0.level1.level2.level3');
            expect(nestedProperty).to.equal(value);
        });
    });
});

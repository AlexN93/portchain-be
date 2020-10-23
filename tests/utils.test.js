import { describe, it } from 'mocha';
import { expect } from 'chai';
import utils from '../src/utils';

require('../src/nativeUtils');

describe('utils', () => {
    describe('sanitizeStrings', () => {
        it('should sanitize and return an array of distinct values from a given string', () => {
            const array = utils.sanitizeStrings('one, two, three,four,, five, ,four');
            expect(array).to.deep.equal(['one', 'two', 'three', 'four', 'five']);
        });
    });

    describe('sanitizeNumbers', () => {
        it('should sanitize and return an array of distinct numbers from a given string', () => {
            const array = utils.sanitizeNumbers('5, 10, 50,75,, 90, ,90');
            expect(array).to.deep.equal([5, 10, 50, 75, 90]);
        });
    });

    describe('hoursBetween', () => {
        const dateFrom = new Date(2020, 1, 15, 5, 0);
        const dateTo = new Date(2020, 1, 15, 3, 30);

        it('should return the relative value of the number of hours between two dates', () => {
            const hours = utils.hoursBetween(dateFrom, dateTo);
            expect(hours).to.equal(-1.5);
        });

        it('should return the absolute value of the number of hours between two dates', () => {
            const hours = utils.hoursBetween(dateFrom, dateTo, true);
            expect(hours).to.equal(1.5);
        });
    });

    describe('percentiles', () => {
        const values = [3, 5, 7, 8, 9, 11, 13, 15];
        it('should return an array of percentiles given an array of input values and pctl points', () => {
            const percentiles = utils.percentiles(values, [25, 50, 75]);
            expect(percentiles).to.deep.equal([{ percentile: 25, value: 5.5 }, { percentile: 50, value: 8.5 }, { percentile: 75, value: 12.5 }]);
        });
    });
});

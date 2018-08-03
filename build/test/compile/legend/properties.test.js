"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var properties = tslib_1.__importStar(require("../../../src/compile/legend/properties"));
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, { field: 'a', type: 'temporal' });
            chai_1.assert.deepEqual(values, [
                { signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)' },
                { signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)' }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('clipHeight()', function () {
        it('should return clip height for continuous domain', function () {
            var height = properties.clipHeight('linear');
            chai_1.assert.equal(height, 20);
        });
        it('should simply return for discrete domain', function () {
            var height = properties.clipHeight('ordinal');
            chai_1.assert.isUndefined(height);
        });
    });
    describe('labelOverlap()', function () {
        it('should return undefined for linear', function () {
            var overlap = properties.labelOverlap('linear');
            chai_1.assert.isUndefined(overlap);
        });
        it('should return greedy for log', function () {
            var overlap = properties.labelOverlap('log');
            chai_1.assert.equal(overlap, 'greedy');
        });
        it('should return greedy for threshold', function () {
            var overlap = properties.labelOverlap('threshold');
            chai_1.assert.equal(overlap, 'greedy');
        });
    });
});
//# sourceMappingURL=properties.test.js.map
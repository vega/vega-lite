/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as properties from '../../../src/compile/legend/properties';
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, { field: 'a', type: 'temporal' });
            assert.deepEqual(values, [
                { signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)' },
                { signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)' }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, { field: 'a', type: 'quantitative' });
            assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('clipHeight()', function () {
        it('should return clip height for continuous domain', function () {
            var height = properties.clipHeight('linear');
            assert.equal(height, 20);
        });
        it('should simply return for discrete domain', function () {
            var height = properties.clipHeight('ordinal');
            assert.isUndefined(height);
        });
    });
    describe('labelOverlap()', function () {
        it('should return undefined for linear', function () {
            var overlap = properties.labelOverlap('linear');
            assert.isUndefined(overlap);
        });
        it('should return greedy for log', function () {
            var overlap = properties.labelOverlap('log');
            assert.equal(overlap, 'greedy');
        });
        it('should return greedy for threshold', function () {
            var overlap = properties.labelOverlap('threshold');
            assert.equal(overlap, 'greedy');
        });
    });
});
//# sourceMappingURL=properties.test.js.map
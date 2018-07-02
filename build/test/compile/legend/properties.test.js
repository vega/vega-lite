/* tslint:disable:quotemark */
import { assert } from 'chai';
import { COLOR, SIZE } from '../../../src/channel';
import * as properties from '../../../src/compile/legend/properties';
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, { field: 'a', type: 'temporal' });
            assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" },
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, { field: 'a', type: 'quantitative' });
            assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('type()', function () {
        it('should return gradient type for color scale', function () {
            var t = properties.type('quantitative', COLOR, 'sequential');
            assert.equal(t, 'gradient');
        });
        it('should not return gradient type for size scale', function () {
            var t = properties.type('quantitative', SIZE, 'linear');
            assert.equal(t, undefined);
        });
        it('should return no type for color scale with bin', function () {
            var t = properties.type('quantitative', COLOR, 'bin-ordinal');
            assert.equal(t, undefined);
        });
        it('should return gradient type for color scale with time scale', function () {
            var t = properties.type('temporal', COLOR, 'time');
            assert.equal(t, 'gradient');
        });
        it('should return no type for color scale with ordinal scale and temporal type', function () {
            var t = properties.type('temporal', COLOR, 'ordinal');
            assert.equal(t, undefined);
        });
        it('should return no type for color scale with ordinal scale and ordinal type', function () {
            var t = properties.type('ordinal', COLOR, 'ordinal');
            assert.equal(t, undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map
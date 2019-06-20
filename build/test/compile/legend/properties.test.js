"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var properties = tslib_1.__importStar(require("../../../src/compile/legend/properties"));
describe('compile/legend', function () {
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, { field: 'a', type: 'temporal' });
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" },
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('type()', function () {
        it('should return gradient type for color scale', function () {
            var t = properties.type('quantitative', channel_1.COLOR, 'sequential');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should not return gradient type for size scale', function () {
            var t = properties.type('quantitative', channel_1.SIZE, 'linear');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with bin', function () {
            var t = properties.type('quantitative', channel_1.COLOR, 'bin-ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return gradient type for color scale with time scale', function () {
            var t = properties.type('temporal', channel_1.COLOR, 'time');
            chai_1.assert.equal(t, 'gradient');
        });
        it('should return no type for color scale with ordinal scale and temporal type', function () {
            var t = properties.type('temporal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
        it('should return no type for color scale with ordinal scale and ordinal type', function () {
            var t = properties.type('ordinal', channel_1.COLOR, 'ordinal');
            chai_1.assert.equal(t, undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map
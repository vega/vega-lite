/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var config_1 = require("../../../src/config");
var rules = require("../../../src/compile/legend/rules");
var type_1 = require("../../../src/type");
describe('compile/legend', function () {
    describe('title()', function () {
        it('should add explicitly specified title', function () {
            var title = rules.title({ title: 'Custom' }, { field: 'a' }, config_1.defaultConfig);
            chai_1.assert.equal(title, 'Custom');
        });
        it('should add return fieldTitle by default', function () {
            var title = rules.title({}, { field: 'a' }, config_1.defaultConfig);
            chai_1.assert.equal(title, 'a');
        });
    });
    describe('values()', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = rules.values({ values: [{ year: 1970 }, { year: 1980 }] });
            chai_1.assert.deepEqual(values, [
                new Date(1970, 0, 1).getTime(),
                new Date(1980, 0, 1).getTime()
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = rules.values({ values: [1, 2, 3, 4] });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('type()', function () {
        it('should return gradient type for color scale', function () {
            var t = rules.type({}, { type: type_1.QUANTITATIVE }, channel_1.COLOR);
            chai_1.assert.equal(t, 'gradient');
        });
        it('should not return gradient type for size scale', function () {
            var t = rules.type({}, { type: type_1.QUANTITATIVE }, channel_1.SIZE);
            chai_1.assert.equal(t, undefined);
        });
        it('should be able to override default', function () {
            var t = rules.type({ type: 'symbol' }, { type: type_1.QUANTITATIVE }, channel_1.COLOR);
            chai_1.assert.equal(t, 'symbol');
        });
        it('should return no type for color scale with bin', function () {
            var t = rules.type({}, { type: type_1.QUANTITATIVE, bin: true }, channel_1.COLOR);
            chai_1.assert.equal(t, undefined);
        });
    });
});
//# sourceMappingURL=rules.test.js.map
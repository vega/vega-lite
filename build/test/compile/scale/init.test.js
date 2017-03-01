"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var init_1 = require("../../../src/compile/scale/init");
var init_2 = require("../../../src/compile/scale/init");
var scale_1 = require("../../../src/scale");
var config_1 = require("../../../src/config");
var util_1 = require("../../../src/util");
describe('compile/scale', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type and range properties', function () {
        chai_1.assert.deepEqual(util_1.toSet(init_2.NON_TYPE_RANGE_SCALE_PROPERTIES), util_1.toSet(util_1.without(scale_1.SCALE_PROPERTIES, ['type', 'range', 'rangeStep', 'scheme'])));
    });
    describe('init', function () {
        it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', function () {
            var scale = init_1.default('x', { field: 'a', type: 'ordinal', scale: { type: 'band', padding: 0.6 } }, config_1.defaultConfig, 'bar', 100, []);
            chai_1.assert.equal(scale.padding, 0.6);
            chai_1.assert.isUndefined(scale.paddingInner);
            chai_1.assert.isUndefined(scale.paddingOuter);
        });
        it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', function () {
            var scale = init_1.default('x', { field: 'a', type: 'ordinal', scale: { type: 'band' } }, { scale: { bandPaddingInner: 0.3 } }, 'bar', 100, []);
            chai_1.assert.equal(scale.paddingInner, 0.3);
            chai_1.assert.equal(scale.paddingOuter, 0.15);
            chai_1.assert.isUndefined(scale.padding);
        });
    });
});
//# sourceMappingURL=init.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var axis_1 = require("../src/axis");
describe('axis', function () {
    describe('VG_AXIS_PROPERTIES', function () {
        it('should have scale and orient as the first two items', function () {
            chai_1.assert.equal(axis_1.VG_AXIS_PROPERTIES[0], 'gridScale');
            chai_1.assert.equal(axis_1.VG_AXIS_PROPERTIES[1], 'scale');
            chai_1.assert.equal(axis_1.VG_AXIS_PROPERTIES[2], 'orient');
        });
    });
});
//# sourceMappingURL=axis.test.js.map
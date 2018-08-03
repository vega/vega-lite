"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var type = tslib_1.__importStar(require("../src/type"));
describe('type', function () {
    describe('getFullName()', function () {
        it('should return correct lowercase, full type names.', function () {
            for (var _i = 0, _a = ['q', 'Q', 'quantitative', 'QUANTITATIVE']; _i < _a.length; _i++) {
                var t = _a[_i];
                chai_1.assert.equal(type.getFullName(t), 'quantitative');
            }
            for (var _b = 0, _c = ['t', 'T', 'temporal', 'TEMPORAL']; _b < _c.length; _b++) {
                var t = _c[_b];
                chai_1.assert.equal(type.getFullName(t), 'temporal');
            }
            for (var _d = 0, _e = ['o', 'O', 'ordinal', 'ORDINAL']; _d < _e.length; _d++) {
                var t = _e[_d];
                chai_1.assert.equal(type.getFullName(t), 'ordinal');
            }
            for (var _f = 0, _g = ['n', 'N', 'nominal', 'NOMINAL']; _f < _g.length; _f++) {
                var t = _g[_f];
                chai_1.assert.equal(type.getFullName(t), 'nominal');
            }
            for (var _h = 0, _j = ['geojson', 'GEOJSON']; _h < _j.length; _h++) {
                var t = _j[_h];
                chai_1.assert.equal(type.getFullName(t), 'geojson');
            }
        });
        it('should return undefined for invalid type', function () {
            chai_1.assert.equal(type.getFullName('haha'), undefined);
        });
    });
});
//# sourceMappingURL=type.test.js.map
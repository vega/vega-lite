import { assert } from 'chai';
import * as type from '../src/type';
describe('type', function () {
    describe('getFullName()', function () {
        it('should return correct lowercase, full type names.', function () {
            for (var _i = 0, _a = ['q', 'Q', 'quantitative', 'QUANTITATIVE']; _i < _a.length; _i++) {
                var t = _a[_i];
                assert.equal(type.getFullName(t), 'quantitative');
            }
            for (var _b = 0, _c = ['t', 'T', 'temporal', 'TEMPORAL']; _b < _c.length; _b++) {
                var t = _c[_b];
                assert.equal(type.getFullName(t), 'temporal');
            }
            for (var _d = 0, _e = ['o', 'O', 'ordinal', 'ORDINAL']; _d < _e.length; _d++) {
                var t = _e[_d];
                assert.equal(type.getFullName(t), 'ordinal');
            }
            for (var _f = 0, _g = ['n', 'N', 'nominal', 'NOMINAL']; _f < _g.length; _f++) {
                var t = _g[_f];
                assert.equal(type.getFullName(t), 'nominal');
            }
            for (var _h = 0, _j = ['latitude', 'LATITUDE']; _h < _j.length; _h++) {
                var t = _j[_h];
                assert.equal(type.getFullName(t), 'latitude');
            }
            for (var _k = 0, _l = ['longitude', 'LONGITUDE']; _k < _l.length; _k++) {
                var t = _l[_k];
                assert.equal(type.getFullName(t), 'longitude');
            }
            for (var _m = 0, _o = ['geojson', 'GEOJSON']; _m < _o.length; _m++) {
                var t = _o[_m];
                assert.equal(type.getFullName(t), 'geojson');
            }
        });
        it('should return undefined for invalid type', function () {
            assert.equal(type.getFullName('haha'), undefined);
        });
    });
});
//# sourceMappingURL=type.test.js.map
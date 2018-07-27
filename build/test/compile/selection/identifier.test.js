import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { assembleRootData } from '../../../src/compile/data/assemble';
import { optimizeDataflow } from '../../../src/compile/data/optimize';
import { parseModel } from '../../util';
/* tslint:disable:quotemark */
function getVgData(selection, x, y, mark, enc, transform) {
    var model = parseModel({
        data: { url: 'data/cars.json' },
        transform: transform,
        selection: selection,
        mark: mark || 'circle',
        encoding: tslib_1.__assign({ x: tslib_1.__assign({ field: 'Horsepower', type: 'quantitative' }, x), y: tslib_1.__assign({ field: 'Miles-per-Gallon', type: 'quantitative' }, y), color: { field: 'Origin', type: 'nominal' } }, enc)
    });
    model.parse();
    optimizeDataflow(model.component.data);
    return assembleRootData(model.component.data, {});
}
describe('Identifier transform', function () {
    it('is not unnecessarily added', function () {
        function test(selDef) {
            var data = getVgData(selDef);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                assert.isNotTrue(d.transform && d.transform.some(function (t) { return t.type === 'identifier'; }));
            }
        }
        test();
        for (var _i = 0, _a = ['single', 'multi']; _i < _a.length; _i++) {
            var type = _a[_i];
            test({ pt: { type: type, encodings: ['x'] } });
        }
    });
    it('is added for default point selections', function () {
        for (var _i = 0, _a = ['single', 'multi']; _i < _a.length; _i++) {
            var type = _a[_i];
            var url = getVgData({ pt: { type: type } });
            assert.equal(url[0].transform[0].type, 'identifier');
        }
    });
    it('is added immediately after aggregate transforms', function () {
        function test(transform) {
            var aggr = -1;
            transform.some(function (t, i) { return ((aggr = i), t.type === 'aggregate'); });
            assert.isAtLeast(aggr, 0);
            assert.equal(transform[aggr + 1].type, 'identifier');
        }
        for (var _i = 0, _a = ['single', 'multi']; _i < _a.length; _i++) {
            var type = _a[_i];
            var sel = { pt: { type: type } };
            var data = getVgData(sel, { bin: true }, { aggregate: 'count' });
            test(data[0].transform);
            data = getVgData(sel, { aggregate: 'sum' }, null, 'bar', { column: { field: 'Cylinders', type: 'ordinal' } });
            test(data[0].transform);
        }
    });
    it('is added before any user-specified transforms', function () {
        var _loop_1 = function (type) {
            var data = getVgData({ pt: { type: type } }, null, null, null, null, [{ calculate: 'datum.Horsepower * 2', as: 'foo' }]);
            var calc = -1;
            data[0].transform.some(function (t, i) { return ((calc = i), t.type === 'formula' && t.as === 'foo'); });
            assert.equal(data[0].transform[calc - 1].type, 'identifier');
        };
        for (var _i = 0, _a = ['single', 'multi']; _i < _a.length; _i++) {
            var type = _a[_i];
            _loop_1(type);
        }
    });
});
//# sourceMappingURL=identifier.test.js.map
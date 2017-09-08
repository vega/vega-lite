"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/data/assemble");
var optimize_1 = require("../../../src/compile/data/optimize");
var util_1 = require("../../util");
/* tslint:disable:quotemark */
function getVgData(selection, x, y, mark, enc, transform) {
    var model = util_1.parseModel({
        data: { url: 'data/cars.json' },
        transform: transform,
        selection: selection,
        mark: mark || 'circle',
        encoding: tslib_1.__assign({ x: tslib_1.__assign({ field: 'Horsepower', type: 'quantitative' }, x), y: tslib_1.__assign({ field: 'Miles-per-Gallon', type: 'quantitative' }, y), color: { field: 'Origin', type: 'nominal' } }, enc)
    });
    model.parse();
    optimize_1.optimizeDataflow(model.component.data);
    return assemble_1.assembleRootData(model.component.data);
}
describe('Identifier transform', function () {
    it('is not unnecessarily added', function () {
        function test(selDef) {
            var data = getVgData(selDef);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                chai_1.assert.isNotTrue(d.transform && d.transform.some(function (t) { return t.type === 'identifier'; }));
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
            chai_1.assert.equal(url[0].transform[0].type, 'identifier');
        }
    });
    it('is added immediately after aggregate transforms', function () {
        function test(transform) {
            var aggr = -1;
            transform.some(function (t, i) { return (aggr = i, t.type === 'aggregate'); });
            chai_1.assert.isAtLeast(aggr, 0);
            chai_1.assert.equal(transform[aggr + 1].type, 'identifier');
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
            data[0].transform.some(function (t, i) { return (calc = i, t.type === 'formula' && t.as === 'foo'); });
            chai_1.assert.equal(data[0].transform[calc - 1].type, 'identifier');
        };
        for (var _i = 0, _a = ['single', 'multi']; _i < _a.length; _i++) {
            var type = _a[_i];
            _loop_1(type);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9pZGVudGlmaWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBQzVCLCtEQUFvRTtBQUNwRSwrREFBb0U7QUFHcEUsbUNBQXNDO0FBRXRDLDhCQUE4QjtBQUU5QixtQkFBbUIsU0FBYyxFQUFFLENBQU8sRUFBRSxDQUFPLEVBQUUsSUFBVyxFQUFFLEdBQVMsRUFBRSxTQUFlO0lBQzFGLElBQU0sS0FBSyxHQUFHLGlCQUFVLENBQUM7UUFDdkIsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFDO1FBQzdCLFNBQVMsV0FBQTtRQUNULFNBQVMsV0FBQTtRQUNULElBQUksRUFBRSxJQUFJLElBQUksUUFBUTtRQUN0QixRQUFRLHFCQUNOLENBQUMscUJBQUcsS0FBSyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsY0FBYyxJQUFLLENBQUMsR0FDbkQsQ0FBQyxxQkFBRyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLGNBQWMsSUFBSyxDQUFDLEdBQ3pELEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxJQUN0QyxHQUFHLENBQ1A7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCwyQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQywyQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLGNBQWMsTUFBWTtZQUN4QixJQUFNLElBQUksR0FBRyxTQUFT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
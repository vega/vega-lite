"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var util_1 = require("../../util");
function getVgData(selection, x, y, mark, enc, transform) {
    var model = util_1.parseModel({
        data: { url: 'data/cars.json' },
        transform: transform,
        selection: selection,
        mark: mark || 'circle',
        encoding: tslib_1.__assign({ x: tslib_1.__assign({ field: 'Horsepower', type: 'quantitative' }, x), y: tslib_1.__assign({ field: 'Miles-per-Gallon', type: 'quantitative' }, y), color: { field: 'Origin', type: 'nominal' } }, enc)
    });
    model.parse();
    return model.assembleData();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9pZGVudGlmaWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsOEJBQThCO0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBc0M7QUFFdEMsbUJBQW1CLFNBQWMsRUFBRSxDQUFPLEVBQUUsQ0FBTyxFQUFFLElBQVcsRUFBRSxHQUFTLEVBQUUsU0FBZTtJQUMxRixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztRQUM3QixTQUFTLFdBQUE7UUFDVCxTQUFTLFdBQUE7UUFDVCxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVE7UUFDdEIsUUFBUSxxQkFDTixDQUFDLHFCQUFHLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLGNBQWMsSUFBSyxDQUFDLEdBQ25ELENBQUMscUJBQUcsS0FBSyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUN6RCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsSUFDdEMsR0FBRyxDQUNQO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM5QixDQUFDO0FBRUQsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtRQUMvQixjQUFjLE1BQVk7WUFDeEIsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxDQUFZLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJO2dCQUFmLElBQU0sQ0FBQyxhQUFBO2dC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
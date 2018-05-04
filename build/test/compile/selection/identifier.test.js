"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        encoding: __assign({ x: __assign({ field: 'Horsepower', type: 'quantitative' }, x), y: __assign({ field: 'Miles-per-Gallon', type: 'quantitative' }, y), color: { field: 'Origin', type: 'nominal' } }, enc)
    });
    model.parse();
    optimize_1.optimizeDataflow(model.component.data);
    return assemble_1.assembleRootData(model.component.data, {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9pZGVudGlmaWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1QiwrREFBb0U7QUFDcEUsK0RBQW9FO0FBR3BFLG1DQUFzQztBQUV0Qyw4QkFBOEI7QUFFOUIsbUJBQW1CLFNBQWMsRUFBRSxDQUFPLEVBQUUsQ0FBTyxFQUFFLElBQVcsRUFBRSxHQUFTLEVBQUUsU0FBZTtJQUMxRixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztRQUM3QixTQUFTLFdBQUE7UUFDVCxTQUFTLFdBQUE7UUFDVCxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVE7UUFDdEIsUUFBUSxhQUNOLENBQUMsYUFBRyxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUNuRCxDQUFDLGFBQUcsS0FBSyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUN6RCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsSUFDdEMsR0FBRyxDQUNQO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2QsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxPQUFPLDJCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLGNBQWMsTUFBWTtZQUN4QixJQUFNLElBQUks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QUksR0FBRyxTQUFTLENBQUMsRUFBQyxFQUFFLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBQyxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUN6RCxDQUFDLEVBQUMsU0FBUyxFQUFFLHNCQUFzQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQyxDQUFDO1lBQ3JGLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFORCxLQUFtQixVQUFtQixFQUFuQixNQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7WUFBakMsSUFBTSxJQUFJLFNBQUE7b0JBQUosSUFBSTtTQU1kO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXNzZW1ibGVSb290RGF0YX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hc3NlbWJsZSc7XG5pbXBvcnQge29wdGltaXplRGF0YWZsb3d9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge1ZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZU1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmZ1bmN0aW9uIGdldFZnRGF0YShzZWxlY3Rpb246IGFueSwgeD86IGFueSwgeT86IGFueSwgbWFyaz86IE1hcmssIGVuYz86IGFueSwgdHJhbnNmb3JtPzogYW55KSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgZGF0YToge3VybDogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgdHJhbnNmb3JtLFxuICAgIHNlbGVjdGlvbixcbiAgICBtYXJrOiBtYXJrIHx8ICdjaXJjbGUnLFxuICAgIGVuY29kaW5nOiB7XG4gICAgICB4OiB7ZmllbGQ6ICdIb3JzZXBvd2VyJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIC4uLnh9LFxuICAgICAgeToge2ZpZWxkOiAnTWlsZXMtcGVyLUdhbGxvbicsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCAuLi55fSxcbiAgICAgIGNvbG9yOiB7ZmllbGQ6ICdPcmlnaW4nLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgLi4uZW5jXG4gICAgfVxuICB9KTtcbiAgbW9kZWwucGFyc2UoKTtcbiAgb3B0aW1pemVEYXRhZmxvdyhtb2RlbC5jb21wb25lbnQuZGF0YSk7XG4gIHJldHVybiBhc3NlbWJsZVJvb3REYXRhKG1vZGVsLmNvbXBvbmVudC5kYXRhLCB7fSk7XG59XG5cbmRlc2NyaWJlKCdJZGVudGlmaWVyIHRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuICBpdCgnaXMgbm90IHVubmVjZXNzYXJpbHkgYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB0ZXN0KHNlbERlZj86IGFueSkge1xuICAgICAgY29uc3QgZGF0YSA9IGdldFZnRGF0YShzZWxEZWYpO1xuICAgICAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShkLnRyYW5zZm9ybSAmJiBkLnRyYW5zZm9ybS5zb21lKCh0KSA9PiB0LnR5cGUgPT09ICdpZGVudGlmaWVyJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRlc3QoKTtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgdGVzdCh7cHQ6IHt0eXBlLCBlbmNvZGluZ3M6IFsneCddfX0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2lzIGFkZGVkIGZvciBkZWZhdWx0IHBvaW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3QgdXJsID0gZ2V0VmdEYXRhKHtwdDoge3R5cGV9fSk7XG4gICAgICBhc3NlcnQuZXF1YWwodXJsWzBdLnRyYW5zZm9ybVswXS50eXBlLCAnaWRlbnRpZmllcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2lzIGFkZGVkIGltbWVkaWF0ZWx5IGFmdGVyIGFnZ3JlZ2F0ZSB0cmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gdGVzdCh0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10pIHtcbiAgICAgIGxldCBhZ2dyID0gLTE7XG4gICAgICB0cmFuc2Zvcm0uc29tZSgodCwgaSkgPT4gKGFnZ3IgPSBpLCB0LnR5cGUgPT09ICdhZ2dyZWdhdGUnKSk7XG4gICAgICBhc3NlcnQuaXNBdExlYXN0KGFnZ3IsIDApO1xuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zZm9ybVthZ2dyICsgMV0udHlwZSwgJ2lkZW50aWZpZXInKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3Qgc2VsID0ge3B0OiB7dHlwZX19O1xuICAgICAgbGV0IGRhdGEgPSBnZXRWZ0RhdGEoc2VsLCB7YmluOiB0cnVlfSwge2FnZ3JlZ2F0ZTogJ2NvdW50J30pO1xuICAgICAgdGVzdChkYXRhWzBdLnRyYW5zZm9ybSk7XG5cbiAgICAgIGRhdGEgPSBnZXRWZ0RhdGEoc2VsLCB7YWdncmVnYXRlOiAnc3VtJ30sIG51bGwsICdiYXInLFxuICAgICAgICB7Y29sdW1uOiB7ZmllbGQ6ICdDeWxpbmRlcnMnLCB0eXBlOiAnb3JkaW5hbCd9fSk7XG4gICAgICB0ZXN0KGRhdGFbMF0udHJhbnNmb3JtKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdpcyBhZGRlZCBiZWZvcmUgYW55IHVzZXItc3BlY2lmaWVkIHRyYW5zZm9ybXMnLCBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3QgZGF0YSA9IGdldFZnRGF0YSh7cHQ6IHt0eXBlfX0sIG51bGwsIG51bGwsIG51bGwsIG51bGwsXG4gICAgICAgIFt7Y2FsY3VsYXRlOiAnZGF0dW0uSG9yc2Vwb3dlciAqIDInLCBhczogJ2Zvbyd9XSk7XG4gICAgICBsZXQgY2FsYyA9IC0xO1xuICAgICAgZGF0YVswXS50cmFuc2Zvcm0uc29tZSgodCwgaSkgPT4gKGNhbGMgPSBpLCB0LnR5cGUgPT09ICdmb3JtdWxhJyAmJiB0LmFzID09PSAnZm9vJykpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGFbMF0udHJhbnNmb3JtW2NhbGMgLSAxXS50eXBlLCAnaWRlbnRpZmllcicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
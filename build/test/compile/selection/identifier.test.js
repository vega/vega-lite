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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9pZGVudGlmaWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1QiwrREFBb0U7QUFDcEUsK0RBQW9FO0FBR3BFLG1DQUFzQztBQUV0Qyw4QkFBOEI7QUFFOUIsbUJBQW1CLFNBQWMsRUFBRSxDQUFPLEVBQUUsQ0FBTyxFQUFFLElBQVcsRUFBRSxHQUFTLEVBQUUsU0FBZTtJQUMxRixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztRQUM3QixTQUFTLFdBQUE7UUFDVCxTQUFTLFdBQUE7UUFDVCxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVE7UUFDdEIsUUFBUSxhQUNOLENBQUMsYUFBRyxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUNuRCxDQUFDLGFBQUcsS0FBSyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUN6RCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsSUFDdEMsR0FBRyxDQUNQO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2QsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxNQUFNLENBQUMsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtRQUMvQixjQUFjLE1BQVk7WUFDeEIsSUFBTSxJQUFJLEdBQUcs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QyxFQUFFO2dDQUN2QyxJQUFJO1lBQ2IsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUMsSUFBSSxNQUFBLEVBQUMsRUFBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDekQsQ0FBQyxFQUFDLFNBQVMsRUFBRSxzQkFBc0IsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLEVBQWxELENBQWtELENBQUMsQ0FBQztZQUNyRixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBTkQsR0FBRyxDQUFDLENBQWUsVUFBbUIsRUFBbkIsTUFBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQW5CLGNBQW1CLEVBQW5CLElBQW1CO1lBQWpDLElBQU0sSUFBSSxTQUFBO29CQUFKLElBQUk7U0FNZDtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtvcHRpbWl6ZURhdGFmbG93fSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL29wdGltaXplJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtWZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5mdW5jdGlvbiBnZXRWZ0RhdGEoc2VsZWN0aW9uOiBhbnksIHg/OiBhbnksIHk/OiBhbnksIG1hcms/OiBNYXJrLCBlbmM/OiBhbnksIHRyYW5zZm9ybT86IGFueSkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgIGRhdGE6IHt1cmw6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgIHRyYW5zZm9ybSxcbiAgICBzZWxlY3Rpb24sXG4gICAgbWFyazogbWFyayB8fCAnY2lyY2xlJyxcbiAgICBlbmNvZGluZzoge1xuICAgICAgeDoge2ZpZWxkOiAnSG9yc2Vwb3dlcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCAuLi54fSxcbiAgICAgIHk6IHtmaWVsZDogJ01pbGVzLXBlci1HYWxsb24nLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgLi4ueX0sXG4gICAgICBjb2xvcjoge2ZpZWxkOiAnT3JpZ2luJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgIC4uLmVuY1xuICAgIH1cbiAgfSk7XG4gIG1vZGVsLnBhcnNlKCk7XG4gIG9wdGltaXplRGF0YWZsb3cobW9kZWwuY29tcG9uZW50LmRhdGEpO1xuICByZXR1cm4gYXNzZW1ibGVSb290RGF0YShtb2RlbC5jb21wb25lbnQuZGF0YSk7XG59XG5cbmRlc2NyaWJlKCdJZGVudGlmaWVyIHRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuICBpdCgnaXMgbm90IHVubmVjZXNzYXJpbHkgYWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB0ZXN0KHNlbERlZj86IGFueSkge1xuICAgICAgY29uc3QgZGF0YSA9IGdldFZnRGF0YShzZWxEZWYpO1xuICAgICAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICAgICAgYXNzZXJ0LmlzTm90VHJ1ZShkLnRyYW5zZm9ybSAmJiBkLnRyYW5zZm9ybS5zb21lKCh0KSA9PiB0LnR5cGUgPT09ICdpZGVudGlmaWVyJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRlc3QoKTtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgdGVzdCh7cHQ6IHt0eXBlLCBlbmNvZGluZ3M6IFsneCddfX0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2lzIGFkZGVkIGZvciBkZWZhdWx0IHBvaW50IHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3QgdXJsID0gZ2V0VmdEYXRhKHtwdDoge3R5cGV9fSk7XG4gICAgICBhc3NlcnQuZXF1YWwodXJsWzBdLnRyYW5zZm9ybVswXS50eXBlLCAnaWRlbnRpZmllcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2lzIGFkZGVkIGltbWVkaWF0ZWx5IGFmdGVyIGFnZ3JlZ2F0ZSB0cmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gdGVzdCh0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10pIHtcbiAgICAgIGxldCBhZ2dyID0gLTE7XG4gICAgICB0cmFuc2Zvcm0uc29tZSgodCwgaSkgPT4gKGFnZ3IgPSBpLCB0LnR5cGUgPT09ICdhZ2dyZWdhdGUnKSk7XG4gICAgICBhc3NlcnQuaXNBdExlYXN0KGFnZ3IsIDApO1xuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zZm9ybVthZ2dyICsgMV0udHlwZSwgJ2lkZW50aWZpZXInKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3Qgc2VsID0ge3B0OiB7dHlwZX19O1xuICAgICAgbGV0IGRhdGEgPSBnZXRWZ0RhdGEoc2VsLCB7YmluOiB0cnVlfSwge2FnZ3JlZ2F0ZTogJ2NvdW50J30pO1xuICAgICAgdGVzdChkYXRhWzBdLnRyYW5zZm9ybSk7XG5cbiAgICAgIGRhdGEgPSBnZXRWZ0RhdGEoc2VsLCB7YWdncmVnYXRlOiAnc3VtJ30sIG51bGwsICdiYXInLFxuICAgICAgICB7Y29sdW1uOiB7ZmllbGQ6ICdDeWxpbmRlcnMnLCB0eXBlOiAnb3JkaW5hbCd9fSk7XG4gICAgICB0ZXN0KGRhdGFbMF0udHJhbnNmb3JtKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdpcyBhZGRlZCBiZWZvcmUgYW55IHVzZXItc3BlY2lmaWVkIHRyYW5zZm9ybXMnLCBmdW5jdGlvbigpIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgWydzaW5nbGUnLCAnbXVsdGknXSkge1xuICAgICAgY29uc3QgZGF0YSA9IGdldFZnRGF0YSh7cHQ6IHt0eXBlfX0sIG51bGwsIG51bGwsIG51bGwsIG51bGwsXG4gICAgICAgIFt7Y2FsY3VsYXRlOiAnZGF0dW0uSG9yc2Vwb3dlciAqIDInLCBhczogJ2Zvbyd9XSk7XG4gICAgICBsZXQgY2FsYyA9IC0xO1xuICAgICAgZGF0YVswXS50cmFuc2Zvcm0uc29tZSgodCwgaSkgPT4gKGNhbGMgPSBpLCB0LnR5cGUgPT09ICdmb3JtdWxhJyAmJiB0LmFzID09PSAnZm9vJykpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGFbMF0udHJhbnNmb3JtW2NhbGMgLSAxXS50eXBlLCAnaWRlbnRpZmllcicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
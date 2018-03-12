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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9pZGVudGlmaWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1QiwrREFBb0U7QUFDcEUsK0RBQW9FO0FBR3BFLG1DQUFzQztBQUV0Qyw4QkFBOEI7QUFFOUIsbUJBQW1CLFNBQWMsRUFBRSxDQUFPLEVBQUUsQ0FBTyxFQUFFLElBQVcsRUFBRSxHQUFTLEVBQUUsU0FBZTtJQUMxRixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztRQUM3QixTQUFTLFdBQUE7UUFDVCxTQUFTLFdBQUE7UUFDVCxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVE7UUFDdEIsUUFBUSxhQUNOLENBQUMsYUFBRyxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUNuRCxDQUFDLGFBQUcsS0FBSyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxjQUFjLElBQUssQ0FBQyxHQUN6RCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsSUFDdEMsR0FBRyxDQUNQO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2QsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxNQUFNLENBQUMsMkJBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUMvQixFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDL0IsY0FBYyxNQUFZO1lBQ3hCLElBQU0s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Q0FBQywrQ0FBK0MsRUFBRTtnQ0FDdkMsSUFBSTtZQUNiLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxFQUFDLEVBQUUsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFDLEVBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ3pELENBQUMsRUFBQyxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFsRCxDQUFrRCxDQUFDLENBQUM7WUFDckYsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQU5ELEdBQUcsQ0FBQyxDQUFlLFVBQW1CLEVBQW5CLE1BQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFuQixjQUFtQixFQUFuQixJQUFtQjtZQUFqQyxJQUFNLElBQUksU0FBQTtvQkFBSixJQUFJO1NBTWQ7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7b3B0aW1pemVEYXRhZmxvd30gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9vcHRpbWl6ZSc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4uLy4uLy4uL3NyYy9tYXJrJztcbmltcG9ydCB7VmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlTW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuZnVuY3Rpb24gZ2V0VmdEYXRhKHNlbGVjdGlvbjogYW55LCB4PzogYW55LCB5PzogYW55LCBtYXJrPzogTWFyaywgZW5jPzogYW55LCB0cmFuc2Zvcm0/OiBhbnkpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICBkYXRhOiB7dXJsOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICB0cmFuc2Zvcm0sXG4gICAgc2VsZWN0aW9uLFxuICAgIG1hcms6IG1hcmsgfHwgJ2NpcmNsZScsXG4gICAgZW5jb2Rpbmc6IHtcbiAgICAgIHg6IHtmaWVsZDogJ0hvcnNlcG93ZXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgLi4ueH0sXG4gICAgICB5OiB7ZmllbGQ6ICdNaWxlcy1wZXItR2FsbG9uJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIC4uLnl9LFxuICAgICAgY29sb3I6IHtmaWVsZDogJ09yaWdpbicsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICAuLi5lbmNcbiAgICB9XG4gIH0pO1xuICBtb2RlbC5wYXJzZSgpO1xuICBvcHRpbWl6ZURhdGFmbG93KG1vZGVsLmNvbXBvbmVudC5kYXRhKTtcbiAgcmV0dXJuIGFzc2VtYmxlUm9vdERhdGEobW9kZWwuY29tcG9uZW50LmRhdGEsIHt9KTtcbn1cblxuZGVzY3JpYmUoJ0lkZW50aWZpZXIgdHJhbnNmb3JtJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdpcyBub3QgdW5uZWNlc3NhcmlseSBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIHRlc3Qoc2VsRGVmPzogYW55KSB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0VmdEYXRhKHNlbERlZik7XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZGF0YSkge1xuICAgICAgICBhc3NlcnQuaXNOb3RUcnVlKGQudHJhbnNmb3JtICYmIGQudHJhbnNmb3JtLnNvbWUoKHQpID0+IHQudHlwZSA9PT0gJ2lkZW50aWZpZXInKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGVzdCgpO1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiBbJ3NpbmdsZScsICdtdWx0aSddKSB7XG4gICAgICB0ZXN0KHtwdDoge3R5cGUsIGVuY29kaW5nczogWyd4J119fSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnaXMgYWRkZWQgZm9yIGRlZmF1bHQgcG9pbnQgc2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiBbJ3NpbmdsZScsICdtdWx0aSddKSB7XG4gICAgICBjb25zdCB1cmwgPSBnZXRWZ0RhdGEoe3B0OiB7dHlwZX19KTtcbiAgICAgIGFzc2VydC5lcXVhbCh1cmxbMF0udHJhbnNmb3JtWzBdLnR5cGUsICdpZGVudGlmaWVyJyk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnaXMgYWRkZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYWdncmVnYXRlIHRyYW5zZm9ybXMnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB0ZXN0KHRyYW5zZm9ybTogVmdUcmFuc2Zvcm1bXSkge1xuICAgICAgbGV0IGFnZ3IgPSAtMTtcbiAgICAgIHRyYW5zZm9ybS5zb21lKCh0LCBpKSA9PiAoYWdnciA9IGksIHQudHlwZSA9PT0gJ2FnZ3JlZ2F0ZScpKTtcbiAgICAgIGFzc2VydC5pc0F0TGVhc3QoYWdnciwgMCk7XG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNmb3JtW2FnZ3IgKyAxXS50eXBlLCAnaWRlbnRpZmllcicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdHlwZSBvZiBbJ3NpbmdsZScsICdtdWx0aSddKSB7XG4gICAgICBjb25zdCBzZWwgPSB7cHQ6IHt0eXBlfX07XG4gICAgICBsZXQgZGF0YSA9IGdldFZnRGF0YShzZWwsIHtiaW46IHRydWV9LCB7YWdncmVnYXRlOiAnY291bnQnfSk7XG4gICAgICB0ZXN0KGRhdGFbMF0udHJhbnNmb3JtKTtcblxuICAgICAgZGF0YSA9IGdldFZnRGF0YShzZWwsIHthZ2dyZWdhdGU6ICdzdW0nfSwgbnVsbCwgJ2JhcicsXG4gICAgICAgIHtjb2x1bW46IHtmaWVsZDogJ0N5bGluZGVycycsIHR5cGU6ICdvcmRpbmFsJ319KTtcbiAgICAgIHRlc3QoZGF0YVswXS50cmFuc2Zvcm0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2lzIGFkZGVkIGJlZm9yZSBhbnkgdXNlci1zcGVjaWZpZWQgdHJhbnNmb3JtcycsIGZ1bmN0aW9uKCkge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiBbJ3NpbmdsZScsICdtdWx0aSddKSB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0VmdEYXRhKHtwdDoge3R5cGV9fSwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxcbiAgICAgICAgW3tjYWxjdWxhdGU6ICdkYXR1bS5Ib3JzZXBvd2VyICogMicsIGFzOiAnZm9vJ31dKTtcbiAgICAgIGxldCBjYWxjID0gLTE7XG4gICAgICBkYXRhWzBdLnRyYW5zZm9ybS5zb21lKCh0LCBpKSA9PiAoY2FsYyA9IGksIHQudHlwZSA9PT0gJ2Zvcm11bGEnICYmIHQuYXMgPT09ICdmb28nKSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0YVswXS50cmFuc2Zvcm1bY2FsYyAtIDFdLnR5cGUsICdpZGVudGlmaWVyJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
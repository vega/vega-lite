"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable quotemark */
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var single_1 = tslib_1.__importDefault(require("../../../src/compile/selection/single"));
var util_1 = require("../../util");
describe('Single Selection', function () {
    var model = util_1.parseUnitModelWithScale({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative", "bin": true },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "single" },
        "two": {
            "type": "single", "nearest": true,
            "on": "mouseover", "encodings": ["y", "color"]
        }
    });
    it('builds tuple signals', function () {
        var oneSg = single_1.default.signals(model, selCmpts['one']);
        chai_1.assert.sameDeepMembers(oneSg, [{
                name: 'one_tuple',
                value: {},
                on: [{
                        events: selCmpts['one'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [], fields: [\"_vgsid_\"], values: [datum[\"_vgsid_\"]]} : null",
                        force: true
                    }]
            }]);
        var twoSg = single_1.default.signals(model, selCmpts['two']);
        chai_1.assert.sameDeepMembers(twoSg, [{
                name: 'two_tuple',
                value: {},
                on: [{
                        events: selCmpts['two'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [\"y\", \"color\"], fields: [\"Miles_per_Gallon\", \"Origin\"], values: [[(item().isVoronoi ? datum.datum : datum)[\"bin_maxbins_10_Miles_per_Gallon\"], (item().isVoronoi ? datum.datum : datum)[\"bin_maxbins_10_Miles_per_Gallon_end\"]], (item().isVoronoi ? datum.datum : datum)[\"Origin\"]], \"bin_Miles_per_Gallon\": 1} : null",
                        force: true
                    }]
            }]);
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify signals', function () {
        var oneExpr = single_1.default.modifyExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'one_tuple, true');
        var twoExpr = single_1.default.modifyExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'two_tuple, true');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "one_modify",
                "on": [
                    {
                        "events": { "signal": "one_tuple" },
                        "update": "modify(\"one_store\", " + oneExpr + ")"
                    }
                ]
            },
            {
                "name": "two_modify",
                "on": [
                    {
                        "events": { "signal": "two_tuple" },
                        "update": "modify(\"two_store\", " + twoExpr + ")"
                    }
                ]
            }
        ]);
    });
    it('builds top-level signals', function () {
        var oneSg = single_1.default.topLevelSignals(model, selCmpts['one'], []);
        chai_1.assert.sameDeepMembers(oneSg, [{
                name: 'one', update: 'data(\"one_store\").length && {_vgsid_: data(\"one_store\")[0].values[0]}'
            }]);
        var twoSg = single_1.default.topLevelSignals(model, selCmpts['two'], []);
        chai_1.assert.sameDeepMembers(twoSg, [{
                name: 'two', update: 'data(\"two_store\").length && {Miles_per_Gallon: data(\"two_store\")[0].values[0], Origin: data(\"two_store\")[0].values[1]}'
            }]);
        var signals = selection.assembleTopLevelSignals(model, []);
        chai_1.assert.deepEqual(signals, [
            {
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            }
        ].concat(oneSg, twoSg));
    });
    it('builds unit datasets', function () {
        var data = [];
        chai_1.assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
            { name: 'one_store' }, { name: 'two_store' }
        ]);
    });
    it('leaves marks alone', function () {
        var marks = [];
        model.component.selection = { one: selCmpts['one'] };
        chai_1.assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhCQUE4QjtBQUM5Qiw2QkFBNEI7QUFFNUIsMEZBQXNFO0FBQ3RFLHlGQUEyRDtBQUMzRCxtQ0FBbUQ7QUFHbkQsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1FBQ3BDLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1lBQ3RFLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDL0UsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQztRQUN6QixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJO1lBQ2pDLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztTQUMvQztLQUNGLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtRQUN6QixJQUFNLEtBQUssR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7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bXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCBzaW5nbGUgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5kZXNjcmliZSgnU2luZ2xlIFNlbGVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYmluXCI6IHRydWV9LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBzZWxDbXB0cyA9IG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1widHlwZVwiOiBcInNpbmdsZVwifSxcbiAgICBcInR3b1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJzaW5nbGVcIiwgXCJuZWFyZXN0XCI6IHRydWUsXG4gICAgICBcIm9uXCI6IFwibW91c2VvdmVyXCIsIFwiZW5jb2RpbmdzXCI6IFtcInlcIiwgXCJjb2xvclwiXVxuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyB0dXBsZSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lU2cgPSBzaW5nbGUuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKG9uZVNnLCBbe1xuICAgICAgbmFtZTogJ29uZV90dXBsZScsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0c1snb25lJ10uZXZlbnRzLFxuICAgICAgICB1cGRhdGU6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyB7dW5pdDogXFxcIlxcXCIsIGVuY29kaW5nczogW10sIGZpZWxkczogW1xcXCJfdmdzaWRfXFxcIl0sIHZhbHVlczogW2RhdHVtW1xcXCJfdmdzaWRfXFxcIl1dfSA6IG51bGxcIixcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH1dXG4gICAgfV0pO1xuXG4gICAgY29uc3QgdHdvU2cgPSBzaW5nbGUuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKHR3b1NnLCBbe1xuICAgICAgbmFtZTogJ3R3b190dXBsZScsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0c1sndHdvJ10uZXZlbnRzLFxuICAgICAgICB1cGRhdGU6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyB7dW5pdDogXFxcIlxcXCIsIGVuY29kaW5nczogW1xcXCJ5XFxcIiwgXFxcImNvbG9yXFxcIl0sIGZpZWxkczogW1xcXCJNaWxlc19wZXJfR2FsbG9uXFxcIiwgXFxcIk9yaWdpblxcXCJdLCB2YWx1ZXM6IFtbKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiYmluX21heGJpbnNfMTBfTWlsZXNfcGVyX0dhbGxvblxcXCJdLCAoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJiaW5fbWF4Ymluc18xMF9NaWxlc19wZXJfR2FsbG9uX2VuZFxcXCJdXSwgKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiT3JpZ2luXFxcIl1dLCBcXFwiYmluX01pbGVzX3Blcl9HYWxsb25cXFwiOiAxfSA6IG51bGxcIixcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH1dXG4gICAgfV0pO1xuXG4gICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBvbmVTZy5jb25jYXQodHdvU2cpKTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyBtb2RpZnkgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZUV4cHIgPSBzaW5nbGUubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ29uZSddKTtcbiAgICBhc3NlcnQuZXF1YWwob25lRXhwciwgJ29uZV90dXBsZSwgdHJ1ZScpO1xuXG4gICAgY29uc3QgdHdvRXhwciA9IHNpbmdsZS5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgIGFzc2VydC5lcXVhbCh0d29FeHByLCAndHdvX3R1cGxlLCB0cnVlJyk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJvbmVfdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJvbmVfc3RvcmVcXFwiLCAke29uZUV4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19tb2RpZnlcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidHdvX3R1cGxlXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogYG1vZGlmeShcXFwidHdvX3N0b3JlXFxcIiwgJHt0d29FeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdG9wLWxldmVsIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvbmVTZyA9IHNpbmdsZS50b3BMZXZlbFNpZ25hbHMobW9kZWwsIHNlbENtcHRzWydvbmUnXSwgW10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMob25lU2csIFt7XG4gICAgICBuYW1lOiAnb25lJywgdXBkYXRlOiAnZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIHtfdmdzaWRfOiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS52YWx1ZXNbMF19J1xuICAgIH1dKTtcblxuICAgIGNvbnN0IHR3b1NnID0gc2luZ2xlLnRvcExldmVsU2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddLCBbXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyh0d29TZywgW3tcbiAgICAgIG5hbWU6ICd0d28nLCB1cGRhdGU6ICdkYXRhKFxcXCJ0d29fc3RvcmVcXFwiKS5sZW5ndGggJiYge01pbGVzX3Blcl9HYWxsb246IGRhdGEoXFxcInR3b19zdG9yZVxcXCIpWzBdLnZhbHVlc1swXSwgT3JpZ2luOiBkYXRhKFxcXCJ0d29fc3RvcmVcXFwiKVswXS52YWx1ZXNbMV19J1xuICAgIH1dKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNpZ25hbHMsIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3VuaXQnLFxuICAgICAgICB2YWx1ZToge30sXG4gICAgICAgIG9uOiBbe2V2ZW50czogJ21vdXNlbW92ZScsIHVwZGF0ZTogJ2lzVHVwbGUoZ3JvdXAoKSkgPyBncm91cCgpIDogdW5pdCd9XVxuICAgICAgfVxuICAgIF0uY29uY2F0KG9uZVNnLCB0d29TZykpO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIHVuaXQgZGF0YXNldHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBkYXRhOiBhbnlbXSA9IFtdO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEobW9kZWwsIGRhdGEpLCBbXG4gICAgICB7bmFtZTogJ29uZV9zdG9yZSd9LCB7bmFtZTogJ3R3b19zdG9yZSd9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdsZWF2ZXMgbWFya3MgYWxvbmUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtYXJrczogYW55W10gPSBbXTtcbiAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge29uZTogc2VsQ21wdHNbJ29uZSddfTtcbiAgICBhc3NlcnQuZXF1YWwoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzKG1vZGVsLCBtYXJrcyksIG1hcmtzKTtcbiAgfSk7XG59KTtcbiJdfQ==
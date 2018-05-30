"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable quotemark */
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var single_1 = require("../../../src/compile/selection/single");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUU1QixvRUFBc0U7QUFDdEUsZ0VBQTJEO0FBQzNELG1DQUFtRDtBQUduRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7UUFDcEMsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7WUFDdEUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDO1FBQ3pCLEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDakMsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1NBQy9DO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1FBQ3pCLElBQU0sS0FBSyxHQUFHLGdCQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztR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cG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHNpbmdsZSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2luZ2xlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmRlc2NyaWJlKCdTaW5nbGUgU2VsZWN0aW9uJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJiaW5cIjogdHJ1ZX0sXG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHNlbENtcHRzID0gbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwic2luZ2xlXCJ9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiLCBcIm5lYXJlc3RcIjogdHJ1ZSxcbiAgICAgIFwib25cIjogXCJtb3VzZW92ZXJcIiwgXCJlbmNvZGluZ3NcIjogW1wieVwiLCBcImNvbG9yXCJdXG4gICAgfVxuICB9KTtcblxuICBpdCgnYnVpbGRzIHR1cGxlIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvbmVTZyA9IHNpbmdsZS5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMob25lU2csIFt7XG4gICAgICBuYW1lOiAnb25lX3R1cGxlJyxcbiAgICAgIHZhbHVlOiB7fSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHNlbENtcHRzWydvbmUnXS5ldmVudHMsXG4gICAgICAgIHVwZGF0ZTogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IHt1bml0OiBcXFwiXFxcIiwgZW5jb2RpbmdzOiBbXSwgZmllbGRzOiBbXFxcIl92Z3NpZF9cXFwiXSwgdmFsdWVzOiBbZGF0dW1bXFxcIl92Z3NpZF9cXFwiXV19IDogbnVsbFwiLFxuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfV1cbiAgICB9XSk7XG5cbiAgICBjb25zdCB0d29TZyA9IHNpbmdsZS5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnModHdvU2csIFt7XG4gICAgICBuYW1lOiAndHdvX3R1cGxlJyxcbiAgICAgIHZhbHVlOiB7fSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHNlbENtcHRzWyd0d28nXS5ldmVudHMsXG4gICAgICAgIHVwZGF0ZTogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IHt1bml0OiBcXFwiXFxcIiwgZW5jb2RpbmdzOiBbXFxcInlcXFwiLCBcXFwiY29sb3JcXFwiXSwgZmllbGRzOiBbXFxcIk1pbGVzX3Blcl9HYWxsb25cXFwiLCBcXFwiT3JpZ2luXFxcIl0sIHZhbHVlczogW1soaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJiaW5fbWF4Ymluc18xMF9NaWxlc19wZXJfR2FsbG9uXFxcIl0sIChpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcImJpbl9tYXhiaW5zXzEwX01pbGVzX3Blcl9HYWxsb25fZW5kXFxcIl1dLCAoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJPcmlnaW5cXFwiXV0sIFxcXCJiaW5fTWlsZXNfcGVyX0dhbGxvblxcXCI6IDF9IDogbnVsbFwiLFxuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfV1cbiAgICB9XSk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIG9uZVNnLmNvbmNhdCh0d29TZykpO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIG1vZGlmeSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lRXhwciA9IHNpbmdsZS5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgIGFzc2VydC5lcXVhbChvbmVFeHByLCAnb25lX3R1cGxlLCB0cnVlJyk7XG5cbiAgICBjb25zdCB0d29FeHByID0gc2luZ2xlLm1vZGlmeUV4cHIobW9kZWwsIHNlbENtcHRzWyd0d28nXSk7XG4gICAgYXNzZXJ0LmVxdWFsKHR3b0V4cHIsICd0d29fdHVwbGUsIHRydWUnKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcIm9uZV90dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcIm9uZV9zdG9yZVxcXCIsICR7b25lRXhwcn0pYFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0d29fdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJ0d29fc3RvcmVcXFwiLCAke3R3b0V4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyB0b3AtbGV2ZWwgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZVNnID0gc2luZ2xlLnRvcExldmVsU2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddLCBbXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhvbmVTZywgW3tcbiAgICAgIG5hbWU6ICdvbmUnLCB1cGRhdGU6ICdkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYge192Z3NpZF86IGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnZhbHVlc1swXX0nXG4gICAgfV0pO1xuXG4gICAgY29uc3QgdHdvU2cgPSBzaW5nbGUudG9wTGV2ZWxTaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10sIFtdKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKHR3b1NnLCBbe1xuICAgICAgbmFtZTogJ3R3bycsIHVwZGF0ZTogJ2RhdGEoXFxcInR3b19zdG9yZVxcXCIpLmxlbmd0aCAmJiB7TWlsZXNfcGVyX0dhbGxvbjogZGF0YShcXFwidHdvX3N0b3JlXFxcIilbMF0udmFsdWVzWzBdLCBPcmlnaW46IGRhdGEoXFxcInR3b19zdG9yZVxcXCIpWzBdLnZhbHVlc1sxXX0nXG4gICAgfV0pO1xuXG4gICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVRvcExldmVsU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc2lnbmFscywgW1xuICAgICAge1xuICAgICAgICBuYW1lOiAndW5pdCcsXG4gICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgb246IFt7ZXZlbnRzOiAnbW91c2Vtb3ZlJywgdXBkYXRlOiAnaXNUdXBsZShncm91cCgpKSA/IGdyb3VwKCkgOiB1bml0J31dXG4gICAgICB9XG4gICAgXS5jb25jYXQob25lU2csIHR3b1NnKSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdW5pdCBkYXRhc2V0cycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGRhdGE6IGFueVtdID0gW107XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YShtb2RlbCwgZGF0YSksIFtcbiAgICAgIHtuYW1lOiAnb25lX3N0b3JlJ30sIHtuYW1lOiAndHdvX3N0b3JlJ31cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2xlYXZlcyBtYXJrcyBhbG9uZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1hcmtzOiBhbnlbXSA9IFtdO1xuICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7b25lOiBzZWxDbXB0c1snb25lJ119O1xuICAgIGFzc2VydC5lcXVhbChzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3MobW9kZWwsIG1hcmtzKSwgbWFya3MpO1xuICB9KTtcbn0pO1xuIl19
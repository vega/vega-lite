"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable quotemark */
var chai_1 = require("chai");
var multi_1 = tslib_1.__importDefault(require("../../../src/compile/selection/multi"));
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var util_1 = require("../../util");
describe('Multi Selection', function () {
    var model = util_1.parseUnitModelWithScale({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative", "bin": true },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "multi" },
        "two": {
            "type": "multi", "nearest": true,
            "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["y", "color"]
        }
    });
    it('builds tuple signals', function () {
        var oneSg = multi_1.default.signals(model, selCmpts['one']);
        chai_1.assert.sameDeepMembers(oneSg, [{
                name: 'one_tuple',
                value: {},
                on: [{
                        events: selCmpts['one'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [], fields: [\"_vgsid_\"], values: [datum[\"_vgsid_\"]]} : null",
                        force: true
                    }]
            }]);
        var twoSg = multi_1.default.signals(model, selCmpts['two']);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLHVGQUF5RDtBQUN6RCwwRkFBc0U7QUFDdEUsbUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztRQUNwQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztZQUN0RSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQy9FLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7UUFDeEIsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSTtZQUNoQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztTQUMxRTtLQUNGLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtRQUN6QixJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxhQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNO3dCQUM5QixNQUFNLEVBQUUscUlBQXFJO3dCQUM3SSxLQUFLLEVBQUUsSUFBSTtxQkFDWixDQUFDO2FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRCxhQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNO3dCQUM5QixNQUFNLEVBQUUsNllBQTZZO3dCQUNyWixLQUFLLEVBQUUsSUFBSTtxQkFDWixDQUFDO2FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsNEJBQTRCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1FBQ3pCLElBQU0sSUFBSSxHQUFVLEVBQUUsQ0FBQztRQUN2QixhQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdkUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCLElBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztRQUNuRCxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgbXVsdGkgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL211bHRpJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTXVsdGkgU2VsZWN0aW9uJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJiaW5cIjogdHJ1ZX0sXG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHNlbENtcHRzID0gbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwibXVsdGlcIn0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwibXVsdGlcIiwgXCJuZWFyZXN0XCI6IHRydWUsXG4gICAgICBcIm9uXCI6IFwibW91c2VvdmVyXCIsIFwidG9nZ2xlXCI6IFwiZXZlbnQuY3RybEtleVwiLCBcImVuY29kaW5nc1wiOiBbXCJ5XCIsIFwiY29sb3JcIl1cbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdHVwbGUgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZVNnID0gbXVsdGkuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKG9uZVNnLCBbe1xuICAgICAgbmFtZTogJ29uZV90dXBsZScsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0c1snb25lJ10uZXZlbnRzLFxuICAgICAgICB1cGRhdGU6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyB7dW5pdDogXFxcIlxcXCIsIGVuY29kaW5nczogW10sIGZpZWxkczogW1xcXCJfdmdzaWRfXFxcIl0sIHZhbHVlczogW2RhdHVtW1xcXCJfdmdzaWRfXFxcIl1dfSA6IG51bGxcIixcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH1dXG4gICAgfV0pO1xuXG4gICAgY29uc3QgdHdvU2cgPSBtdWx0aS5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnModHdvU2csIFt7XG4gICAgICBuYW1lOiAndHdvX3R1cGxlJyxcbiAgICAgIHZhbHVlOiB7fSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHNlbENtcHRzWyd0d28nXS5ldmVudHMsXG4gICAgICAgIHVwZGF0ZTogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IHt1bml0OiBcXFwiXFxcIiwgZW5jb2RpbmdzOiBbXFxcInlcXFwiLCBcXFwiY29sb3JcXFwiXSwgZmllbGRzOiBbXFxcIk1pbGVzX3Blcl9HYWxsb25cXFwiLCBcXFwiT3JpZ2luXFxcIl0sIHZhbHVlczogW1soaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJiaW5fbWF4Ymluc18xMF9NaWxlc19wZXJfR2FsbG9uXFxcIl0sIChpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcImJpbl9tYXhiaW5zXzEwX01pbGVzX3Blcl9HYWxsb25fZW5kXFxcIl1dLCAoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJPcmlnaW5cXFwiXV0sIFxcXCJiaW5fTWlsZXNfcGVyX0dhbGxvblxcXCI6IDF9IDogbnVsbFwiLFxuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfV1cbiAgICB9XSk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIG9uZVNnLmNvbmNhdCh0d29TZykpO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIHVuaXQgZGF0YXNldHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBkYXRhOiBhbnlbXSA9IFtdO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvbkRhdGEobW9kZWwsIGRhdGEpLCBbXG4gICAgICB7bmFtZTogJ29uZV9zdG9yZSd9LCB7bmFtZTogJ3R3b19zdG9yZSd9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdsZWF2ZXMgbWFya3MgYWxvbmUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtYXJrczogYW55W10gPSBbXTtcbiAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge29uZTogc2VsQ21wdHNbJ29uZSddfTtcbiAgICBhc3NlcnQuZXF1YWwoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvbk1hcmtzKG1vZGVsLCBtYXJrcyksIG1hcmtzKTtcbiAgfSk7XG59KTtcbiJdfQ==
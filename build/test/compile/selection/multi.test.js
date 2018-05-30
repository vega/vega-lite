"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable quotemark */
var chai_1 = require("chai");
var multi_1 = require("../../../src/compile/selection/multi");
var selection = require("../../../src/compile/selection/selection");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUE4QjtBQUM5Qiw2QkFBNEI7QUFFNUIsOERBQXlEO0FBQ3pELG9FQUFzRTtBQUN0RSxtQ0FBbUQ7QUFFbkQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1FBQ3BDLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1lBQ3RFLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDL0UsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQztRQUN4QixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJO1lBQ2hDLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1NBQzFFO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1FBQ3pCLElBQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELGFBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzdCLElBQUksRUFBRSxXQUFXO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07d0JBQzlCLE1BQU0sRUFBRSxxSUFBcUk7d0JBQzdJLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUM7YUFDSCxDQUFDLENBQUMsQ0FBQztRQUVKLElBQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BELGFBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzdCLElBQUksRUFBRSxXQUFXO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxFQUFFLEVBQUUsQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07d0JBQzlCLE1BQU0sRUFBRSw2WUFBNlk7d0JBQ3JaLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUM7YUFDSCxDQUFDLENBQUMsQ0FBQztRQUVKLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7UUFDekIsSUFBTSxJQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLGFBQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN2RSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUM7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7UUFDdkIsSUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO1FBQ25ELGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCBtdWx0aSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGknO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNdWx0aSBTZWxlY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImJpblwiOiB0cnVlfSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2VsQ21wdHMgPSBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcInR5cGVcIjogXCJtdWx0aVwifSxcbiAgICBcInR3b1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJtdWx0aVwiLCBcIm5lYXJlc3RcIjogdHJ1ZSxcbiAgICAgIFwib25cIjogXCJtb3VzZW92ZXJcIiwgXCJ0b2dnbGVcIjogXCJldmVudC5jdHJsS2V5XCIsIFwiZW5jb2RpbmdzXCI6IFtcInlcIiwgXCJjb2xvclwiXVxuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyB0dXBsZSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lU2cgPSBtdWx0aS5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMob25lU2csIFt7XG4gICAgICBuYW1lOiAnb25lX3R1cGxlJyxcbiAgICAgIHZhbHVlOiB7fSxcbiAgICAgIG9uOiBbe1xuICAgICAgICBldmVudHM6IHNlbENtcHRzWydvbmUnXS5ldmVudHMsXG4gICAgICAgIHVwZGF0ZTogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IHt1bml0OiBcXFwiXFxcIiwgZW5jb2RpbmdzOiBbXSwgZmllbGRzOiBbXFxcIl92Z3NpZF9cXFwiXSwgdmFsdWVzOiBbZGF0dW1bXFxcIl92Z3NpZF9cXFwiXV19IDogbnVsbFwiLFxuICAgICAgICBmb3JjZTogdHJ1ZVxuICAgICAgfV1cbiAgICB9XSk7XG5cbiAgICBjb25zdCB0d29TZyA9IG11bHRpLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyh0d29TZywgW3tcbiAgICAgIG5hbWU6ICd0d29fdHVwbGUnLFxuICAgICAgdmFsdWU6IHt9LFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdHNbJ3R3byddLmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8ge3VuaXQ6IFxcXCJcXFwiLCBlbmNvZGluZ3M6IFtcXFwieVxcXCIsIFxcXCJjb2xvclxcXCJdLCBmaWVsZHM6IFtcXFwiTWlsZXNfcGVyX0dhbGxvblxcXCIsIFxcXCJPcmlnaW5cXFwiXSwgdmFsdWVzOiBbWyhpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcImJpbl9tYXhiaW5zXzEwX01pbGVzX3Blcl9HYWxsb25cXFwiXSwgKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiYmluX21heGJpbnNfMTBfTWlsZXNfcGVyX0dhbGxvbl9lbmRcXFwiXV0sIChpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcIk9yaWdpblxcXCJdXSwgXFxcImJpbl9NaWxlc19wZXJfR2FsbG9uXFxcIjogMX0gOiBudWxsXCIsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgb25lU2cuY29uY2F0KHR3b1NnKSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdW5pdCBkYXRhc2V0cycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGRhdGE6IGFueVtdID0gW107XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uRGF0YShtb2RlbCwgZGF0YSksIFtcbiAgICAgIHtuYW1lOiAnb25lX3N0b3JlJ30sIHtuYW1lOiAndHdvX3N0b3JlJ31cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2xlYXZlcyBtYXJrcyBhbG9uZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1hcmtzOiBhbnlbXSA9IFtdO1xuICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7b25lOiBzZWxDbXB0c1snb25lJ119O1xuICAgIGFzc2VydC5lcXVhbChzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uTWFya3MobW9kZWwsIG1hcmtzKSwgbWFya3MpO1xuICB9KTtcbn0pO1xuIl19
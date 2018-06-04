"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var inputs_1 = tslib_1.__importDefault(require("../../../src/compile/selection/transforms/inputs"));
var util_1 = require("../../util");
describe('Inputs Selection Transform', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    var selCmpts = selection.parseUnitSelection(model, {
        "one": {
            "type": "single",
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "two": {
            "type": "single",
            "fields": ["Cylinders", "Horsepower"],
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "three": {
            "type": "single", "nearest": true,
            "fields": ["Cylinders", "Origin"],
            "bind": {
                "Horsepower": { "input": "range", "min": 0, "max": 10, "step": 1 },
                "Origin": { "input": "select", "options": ["Japan", "USA", "Europe"] }
            }
        },
        "four": {
            "type": "single", "bind": null
        },
        "six": {
            "type": "interval",
            "bind": "scales"
        }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isNotFalse(inputs_1.default.has(selCmpts['one']));
        chai_1.assert.isNotFalse(inputs_1.default.has(selCmpts['two']));
        chai_1.assert.isNotFalse(inputs_1.default.has(selCmpts['three']));
        chai_1.assert.isNotTrue(inputs_1.default.has(selCmpts['four']));
        chai_1.assert.isNotTrue(inputs_1.default.has(selCmpts['six']));
    });
    it('adds widget binding for default projection', function () {
        model.component.selection = { one: selCmpts['one'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "one_tuple",
                "update": "one__vgsid_ ? {fields: [\"_vgsid_\"], values: [one__vgsid_]} : null"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "one__vgsid_",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "datum && item().mark.marktype !== 'group' ? datum[\"_vgsid_\"] : null"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            }
        ]);
    });
    it('adds single widget binding for compound projection', function () {
        model.component.selection = { two: selCmpts['two'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "two_tuple",
                "update": "two_Cylinders && two_Horsepower ? {fields: [\"Cylinders\", \"Horsepower\"], values: [two_Cylinders, two_Horsepower]} : null"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "two_Horsepower",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "datum && item().mark.marktype !== 'group' ? datum[\"Horsepower\"] : null"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            },
            {
                "name": "two_Cylinders",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "datum && item().mark.marktype !== 'group' ? datum[\"Cylinders\"] : null"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            }
        ]);
    });
    it('adds projection-specific widget bindings', function () {
        model.component.selection = { three: selCmpts['three'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "three_tuple",
                "update": "three_Cylinders && three_Origin ? {fields: [\"Cylinders\", \"Origin\"], values: [three_Cylinders, three_Origin]} : null"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "three_Origin",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "datum && item().mark.marktype !== 'group' ? (item().isVoronoi ? datum.datum : datum)[\"Origin\"] : null"
                    }
                ],
                "bind": {
                    "input": "select",
                    "options": ["Japan", "USA", "Europe"]
                }
            },
            {
                "name": "three_Cylinders",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "datum && item().mark.marktype !== 'group' ? (item().isVoronoi ? datum.datum : datum)[\"Cylinders\"] : null"
                    }
                ],
                "bind": {
                    "Horsepower": { "input": "range", "min": 0, "max": 10, "step": 1 },
                    "Origin": {
                        "input": "select",
                        "options": ["Japan", "USA", "Europe"]
                    }
                }
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2lucHV0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMEZBQXNFO0FBQ3RFLG9HQUFzRTtBQUN0RSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFO0lBQ3JDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQ25ELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7U0FDM0Q7UUFDRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsUUFBUTtZQUNoQixRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO1lBQ3JDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFB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bnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCBpbnB1dHMgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnSW5wdXRzIFNlbGVjdGlvbiBUcmFuc2Zvcm0nLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG5cbiAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICBjb25zdCBzZWxDbXB0cyA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJzaW5nbGVcIixcbiAgICAgIFwiYmluZFwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsIFwibWluXCI6IDAsIFwibWF4XCI6IDEwLCBcInN0ZXBcIjogMX1cbiAgICB9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiLFxuICAgICAgXCJmaWVsZHNcIjogW1wiQ3lsaW5kZXJzXCIsIFwiSG9yc2Vwb3dlclwiXSxcbiAgICAgIFwiYmluZFwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsIFwibWluXCI6IDAsIFwibWF4XCI6IDEwLCBcInN0ZXBcIjogMX1cbiAgICB9LFxuICAgIFwidGhyZWVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCIsIFwibmVhcmVzdFwiOiB0cnVlLFxuICAgICAgXCJmaWVsZHNcIjogW1wiQ3lsaW5kZXJzXCIsIFwiT3JpZ2luXCJdLFxuICAgICAgXCJiaW5kXCI6IHtcbiAgICAgICAgXCJIb3JzZXBvd2VyXCI6IHtcImlucHV0XCI6IFwicmFuZ2VcIiwgXCJtaW5cIjogMCwgXCJtYXhcIjogMTAsIFwic3RlcFwiOiAxfSxcbiAgICAgICAgXCJPcmlnaW5cIjoge1wiaW5wdXRcIjogXCJzZWxlY3RcIiwgXCJvcHRpb25zXCI6IFtcIkphcGFuXCIsIFwiVVNBXCIsIFwiRXVyb3BlXCJdfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJmb3VyXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiLCBcImJpbmRcIjogbnVsbFxuICAgIH0sXG4gICAgXCJzaXhcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiYmluZFwiOiBcInNjYWxlc1wiXG4gICAgfVxuICB9KTtcblxuICBpdCgnaWRlbnRpZmllcyB0cmFuc2Zvcm0gaW52b2NhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5pc05vdEZhbHNlKGlucHV0cy5oYXMoc2VsQ21wdHNbJ29uZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UoaW5wdXRzLmhhcyhzZWxDbXB0c1sndHdvJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZShpbnB1dHMuaGFzKHNlbENtcHRzWyd0aHJlZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZShpbnB1dHMuaGFzKHNlbENtcHRzWydmb3VyJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKGlucHV0cy5oYXMoc2VsQ21wdHNbJ3NpeCddKSk7XG4gIH0pO1xuXG4gIGl0KCdhZGRzIHdpZGdldCBiaW5kaW5nIGZvciBkZWZhdWx0IHByb2plY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge29uZTogc2VsQ21wdHNbJ29uZSddfTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSksIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX3R1cGxlXCIsXG4gICAgICAgIFwidXBkYXRlXCI6IFwib25lX192Z3NpZF8gPyB7ZmllbGRzOiBbXFxcIl92Z3NpZF9cXFwiXSwgdmFsdWVzOiBbb25lX192Z3NpZF9dfSA6IG51bGxcIlxuICAgICAgfVxuICAgIF0pO1xuXG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMobW9kZWwsIFtdKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfX3Znc2lkX1wiLFxuICAgICAgICBcInZhbHVlXCI6IFwiXCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzb3VyY2VcIjogXCJzY29wZVwiLFwidHlwZVwiOiBcImNsaWNrXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyBkYXR1bVtcXFwiX3Znc2lkX1xcXCJdIDogbnVsbFwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImJpbmRcIjoge1wiaW5wdXRcIjogXCJyYW5nZVwiLFwibWluXCI6IDAsXCJtYXhcIjogMTAsXCJzdGVwXCI6IDF9XG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdhZGRzIHNpbmdsZSB3aWRnZXQgYmluZGluZyBmb3IgY29tcG91bmQgcHJvamVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7dHdvOiBzZWxDbXB0c1sndHdvJ119O1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0d29fdHVwbGVcIixcbiAgICAgICAgXCJ1cGRhdGVcIjogXCJ0d29fQ3lsaW5kZXJzICYmIHR3b19Ib3JzZXBvd2VyID8ge2ZpZWxkczogW1xcXCJDeWxpbmRlcnNcXFwiLCBcXFwiSG9yc2Vwb3dlclxcXCJdLCB2YWx1ZXM6IFt0d29fQ3lsaW5kZXJzLCB0d29fSG9yc2Vwb3dlcl19IDogbnVsbFwiXG4gICAgICB9XG4gICAgXSk7XG5cbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVRvcExldmVsU2lnbmFscyhtb2RlbCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19Ib3JzZXBvd2VyXCIsXG4gICAgICAgIFwidmFsdWVcIjogXCJcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNvdXJjZVwiOiBcInNjb3BlXCIsXCJ0eXBlXCI6IFwiY2xpY2tcIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IGRhdHVtW1xcXCJIb3JzZXBvd2VyXFxcIl0gOiBudWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiYmluZFwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsXCJtaW5cIjogMCxcIm1heFwiOiAxMCxcInN0ZXBcIjogMX1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19DeWxpbmRlcnNcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIlwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic291cmNlXCI6IFwic2NvcGVcIixcInR5cGVcIjogXCJjbGlja1wifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gZGF0dW1bXFxcIkN5bGluZGVyc1xcXCJdIDogbnVsbFwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImJpbmRcIjoge1wiaW5wdXRcIjogXCJyYW5nZVwiLFwibWluXCI6IDAsXCJtYXhcIjogMTAsXCJzdGVwXCI6IDF9XG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdhZGRzIHByb2plY3Rpb24tc3BlY2lmaWMgd2lkZ2V0IGJpbmRpbmdzJywgZnVuY3Rpb24oKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHt0aHJlZTogc2VsQ21wdHNbJ3RocmVlJ119O1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJlZV90dXBsZVwiLFxuICAgICAgICBcInVwZGF0ZVwiOiBcInRocmVlX0N5bGluZGVycyAmJiB0aHJlZV9PcmlnaW4gPyB7ZmllbGRzOiBbXFxcIkN5bGluZGVyc1xcXCIsIFxcXCJPcmlnaW5cXFwiXSwgdmFsdWVzOiBbdGhyZWVfQ3lsaW5kZXJzLCB0aHJlZV9PcmlnaW5dfSA6IG51bGxcIlxuICAgICAgfVxuICAgIF0pO1xuXG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVUb3BMZXZlbFNpZ25hbHMobW9kZWwsIFtdKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJlZV9PcmlnaW5cIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIlwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic291cmNlXCI6IFwic2NvcGVcIixcInR5cGVcIjogXCJjbGlja1wifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiT3JpZ2luXFxcIl0gOiBudWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiYmluZFwiOiB7XG4gICAgICAgICAgXCJpbnB1dFwiOiBcInNlbGVjdFwiLFxuICAgICAgICAgIFwib3B0aW9uc1wiOiBbXCJKYXBhblwiLFwiVVNBXCIsXCJFdXJvcGVcIl1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidGhyZWVfQ3lsaW5kZXJzXCIsXG4gICAgICAgIFwidmFsdWVcIjogXCJcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNvdXJjZVwiOiBcInNjb3BlXCIsXCJ0eXBlXCI6IFwiY2xpY2tcIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IChpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcIkN5bGluZGVyc1xcXCJdIDogbnVsbFwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImJpbmRcIjoge1xuICAgICAgICAgIFwiSG9yc2Vwb3dlclwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsXCJtaW5cIjogMCxcIm1heFwiOiAxMCxcInN0ZXBcIjogMX0sXG4gICAgICAgICAgXCJPcmlnaW5cIjoge1xuICAgICAgICAgICAgXCJpbnB1dFwiOiBcInNlbGVjdFwiLFxuICAgICAgICAgICAgXCJvcHRpb25zXCI6IFtcIkphcGFuXCIsXCJVU0FcIixcIkV1cm9wZVwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19
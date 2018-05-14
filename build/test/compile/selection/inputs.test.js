/* tslint:disable quotemark */
import { assert } from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import inputs from '../../../src/compile/selection/transforms/inputs';
import { parseUnitModel } from '../../util';
describe('Inputs Selection Transform', function () {
    var model = parseUnitModel({
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
        assert.isNotFalse(inputs.has(selCmpts['one']));
        assert.isNotFalse(inputs.has(selCmpts['two']));
        assert.isNotFalse(inputs.has(selCmpts['three']));
        assert.isNotTrue(inputs.has(selCmpts['four']));
        assert.isNotTrue(inputs.has(selCmpts['six']));
    });
    it('adds widget binding for default projection', function () {
        model.component.selection = { one: selCmpts['one'] };
        assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "one_tuple",
                "update": "one__vgsid_ ? {fields: [\"_vgsid_\"], values: [one__vgsid_]} : null"
            }
        ]);
        assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
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
        assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "two_tuple",
                "update": "two_Cylinders && two_Horsepower ? {fields: [\"Cylinders\", \"Horsepower\"], values: [two_Cylinders, two_Horsepower]} : null"
            }
        ]);
        assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
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
        assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "three_tuple",
                "update": "three_Cylinders && three_Origin ? {fields: [\"Cylinders\", \"Origin\"], values: [three_Cylinders, three_Origin]} : null"
            }
        ]);
        assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2lucHV0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxTQUFTLE1BQU0sMENBQTBDLENBQUM7QUFDdEUsT0FBTyxNQUFNLE1BQU0sa0RBQWtELENBQUM7QUFDdEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUUxQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7SUFDckMsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUNuRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1NBQzNEO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLFlB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Q0FBQztxQkFDcEM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IGlucHV0cyBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vdHJhbnNmb3Jtcy9pbnB1dHMnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdJbnB1dHMgU2VsZWN0aW9uIFRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gIGNvbnN0IHNlbENtcHRzID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiLFxuICAgICAgXCJiaW5kXCI6IHtcImlucHV0XCI6IFwicmFuZ2VcIiwgXCJtaW5cIjogMCwgXCJtYXhcIjogMTAsIFwic3RlcFwiOiAxfVxuICAgIH0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCIsXG4gICAgICBcImZpZWxkc1wiOiBbXCJDeWxpbmRlcnNcIiwgXCJIb3JzZXBvd2VyXCJdLFxuICAgICAgXCJiaW5kXCI6IHtcImlucHV0XCI6IFwicmFuZ2VcIiwgXCJtaW5cIjogMCwgXCJtYXhcIjogMTAsIFwic3RlcFwiOiAxfVxuICAgIH0sXG4gICAgXCJ0aHJlZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJzaW5nbGVcIiwgXCJuZWFyZXN0XCI6IHRydWUsXG4gICAgICBcImZpZWxkc1wiOiBbXCJDeWxpbmRlcnNcIiwgXCJPcmlnaW5cIl0sXG4gICAgICBcImJpbmRcIjoge1xuICAgICAgICBcIkhvcnNlcG93ZXJcIjoge1wiaW5wdXRcIjogXCJyYW5nZVwiLCBcIm1pblwiOiAwLCBcIm1heFwiOiAxMCwgXCJzdGVwXCI6IDF9LFxuICAgICAgICBcIk9yaWdpblwiOiB7XCJpbnB1dFwiOiBcInNlbGVjdFwiLCBcIm9wdGlvbnNcIjogW1wiSmFwYW5cIiwgXCJVU0FcIiwgXCJFdXJvcGVcIl19XG4gICAgICB9XG4gICAgfSxcbiAgICBcImZvdXJcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCIsIFwiYmluZFwiOiBudWxsXG4gICAgfSxcbiAgICBcInNpeFwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJiaW5kXCI6IFwic2NhbGVzXCJcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdpZGVudGlmaWVzIHRyYW5zZm9ybSBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UoaW5wdXRzLmhhcyhzZWxDbXB0c1snb25lJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZShpbnB1dHMuaGFzKHNlbENtcHRzWyd0d28nXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKGlucHV0cy5oYXMoc2VsQ21wdHNbJ3RocmVlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKGlucHV0cy5oYXMoc2VsQ21wdHNbJ2ZvdXInXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUoaW5wdXRzLmhhcyhzZWxDbXB0c1snc2l4J10pKTtcbiAgfSk7XG5cbiAgaXQoJ2FkZHMgd2lkZ2V0IGJpbmRpbmcgZm9yIGRlZmF1bHQgcHJvamVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7b25lOiBzZWxDbXB0c1snb25lJ119O1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfdHVwbGVcIixcbiAgICAgICAgXCJ1cGRhdGVcIjogXCJvbmVfX3Znc2lkXyA/IHtmaWVsZHM6IFtcXFwiX3Znc2lkX1xcXCJdLCB2YWx1ZXM6IFtvbmVfX3Znc2lkX119IDogbnVsbFwiXG4gICAgICB9XG4gICAgXSk7XG5cbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVRvcExldmVsU2lnbmFscyhtb2RlbCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9fdmdzaWRfXCIsXG4gICAgICAgIFwidmFsdWVcIjogXCJcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNvdXJjZVwiOiBcInNjb3BlXCIsXCJ0eXBlXCI6IFwiY2xpY2tcIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJkYXR1bSAmJiBpdGVtKCkubWFyay5tYXJrdHlwZSAhPT0gJ2dyb3VwJyA/IGRhdHVtW1xcXCJfdmdzaWRfXFxcIl0gOiBudWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiYmluZFwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsXCJtaW5cIjogMCxcIm1heFwiOiAxMCxcInN0ZXBcIjogMX1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2FkZHMgc2luZ2xlIHdpZGdldCBiaW5kaW5nIGZvciBjb21wb3VuZCBwcm9qZWN0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHt0d286IHNlbENtcHRzWyd0d28nXX07XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b190dXBsZVwiLFxuICAgICAgICBcInVwZGF0ZVwiOiBcInR3b19DeWxpbmRlcnMgJiYgdHdvX0hvcnNlcG93ZXIgPyB7ZmllbGRzOiBbXFxcIkN5bGluZGVyc1xcXCIsIFxcXCJIb3JzZXBvd2VyXFxcIl0sIHZhbHVlczogW3R3b19DeWxpbmRlcnMsIHR3b19Ib3JzZXBvd2VyXX0gOiBudWxsXCJcbiAgICAgIH1cbiAgICBdKTtcblxuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2VsZWN0aW9uLmFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzKG1vZGVsLCBbXSksIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX0hvcnNlcG93ZXJcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIlwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic291cmNlXCI6IFwic2NvcGVcIixcInR5cGVcIjogXCJjbGlja1wifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gZGF0dW1bXFxcIkhvcnNlcG93ZXJcXFwiXSA6IG51bGxcIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJiaW5kXCI6IHtcImlucHV0XCI6IFwicmFuZ2VcIixcIm1pblwiOiAwLFwibWF4XCI6IDEwLFwic3RlcFwiOiAxfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX0N5bGluZGVyc1wiLFxuICAgICAgICBcInZhbHVlXCI6IFwiXCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzb3VyY2VcIjogXCJzY29wZVwiLFwidHlwZVwiOiBcImNsaWNrXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyBkYXR1bVtcXFwiQ3lsaW5kZXJzXFxcIl0gOiBudWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiYmluZFwiOiB7XCJpbnB1dFwiOiBcInJhbmdlXCIsXCJtaW5cIjogMCxcIm1heFwiOiAxMCxcInN0ZXBcIjogMX1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2FkZHMgcHJvamVjdGlvbi1zcGVjaWZpYyB3aWRnZXQgYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcbiAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3RocmVlOiBzZWxDbXB0c1sndGhyZWUnXX07XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRocmVlX3R1cGxlXCIsXG4gICAgICAgIFwidXBkYXRlXCI6IFwidGhyZWVfQ3lsaW5kZXJzICYmIHRocmVlX09yaWdpbiA/IHtmaWVsZHM6IFtcXFwiQ3lsaW5kZXJzXFxcIiwgXFxcIk9yaWdpblxcXCJdLCB2YWx1ZXM6IFt0aHJlZV9DeWxpbmRlcnMsIHRocmVlX09yaWdpbl19IDogbnVsbFwiXG4gICAgICB9XG4gICAgXSk7XG5cbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVRvcExldmVsU2lnbmFscyhtb2RlbCwgW10pLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRocmVlX09yaWdpblwiLFxuICAgICAgICBcInZhbHVlXCI6IFwiXCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzb3VyY2VcIjogXCJzY29wZVwiLFwidHlwZVwiOiBcImNsaWNrXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyAoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJPcmlnaW5cXFwiXSA6IG51bGxcIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJiaW5kXCI6IHtcbiAgICAgICAgICBcImlucHV0XCI6IFwic2VsZWN0XCIsXG4gICAgICAgICAgXCJvcHRpb25zXCI6IFtcIkphcGFuXCIsXCJVU0FcIixcIkV1cm9wZVwiXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJlZV9DeWxpbmRlcnNcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBcIlwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic291cmNlXCI6IFwic2NvcGVcIixcInR5cGVcIjogXCJjbGlja1wifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8gKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiQ3lsaW5kZXJzXFxcIl0gOiBudWxsXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiYmluZFwiOiB7XG4gICAgICAgICAgXCJIb3JzZXBvd2VyXCI6IHtcImlucHV0XCI6IFwicmFuZ2VcIixcIm1pblwiOiAwLFwibWF4XCI6IDEwLFwic3RlcFwiOiAxfSxcbiAgICAgICAgICBcIk9yaWdpblwiOiB7XG4gICAgICAgICAgICBcImlucHV0XCI6IFwic2VsZWN0XCIsXG4gICAgICAgICAgICBcIm9wdGlvbnNcIjogW1wiSmFwYW5cIixcIlVTQVwiLFwiRXVyb3BlXCJdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=
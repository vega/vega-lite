"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var toggle_1 = require("../../../src/compile/selection/transforms/toggle");
var util_1 = require("../../util");
describe('Toggle Selection Transform', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "multi" },
        "two": {
            "type": "multi", "resolve": "union",
            "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["y", "color"]
        },
        "three": { "type": "multi", "toggle": false },
        "four": { "type": "multi", "toggle": null },
        "five": { "type": "single" },
        "six": { "type": "interval" }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isNotFalse(toggle_1.default.has(selCmpts['one']));
        chai_1.assert.isNotFalse(toggle_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['three']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['four']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['five']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['six']));
    });
    it('builds toggle signals', function () {
        var oneSg = toggle_1.default.signals(model, selCmpts['one'], []);
        chai_1.assert.sameDeepMembers(oneSg, [{
                name: 'one_toggle',
                value: false,
                on: [{
                        events: selCmpts['one'].events,
                        update: 'event.shiftKey'
                    }]
            }]);
        var twoSg = toggle_1.default.signals(model, selCmpts['two'], []);
        chai_1.assert.sameDeepMembers(twoSg, [{
                name: 'two_toggle',
                value: false,
                on: [{
                        events: selCmpts['two'].events,
                        update: 'event.ctrlKey'
                    }]
            }]);
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify expr', function () {
        var oneExpr = toggle_1.default.modifyExpr(model, selCmpts['one'], '');
        chai_1.assert.equal(oneExpr, 'one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');
        var twoExpr = toggle_1.default.modifyExpr(model, selCmpts['two'], '');
        chai_1.assert.equal(twoExpr, 'two_toggle ? null : two_tuple, two_toggle ? null : {unit: \"\"}, two_toggle ? two_tuple : null');
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3RvZ2dsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixvRUFBc0U7QUFDdEUsMkVBQXNFO0FBQ3RFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7SUFDckMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDL0UsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQztRQUN4QixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPO1lBQ25DLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1NBQzFFO1FBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO1FBQzNDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFP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Qyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUNqQztnQkFDRSxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsSUFBSSxFQUFFO29CQUNKO3dCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUM7d0JBQ2pDLFFBQVEsRUFBRSwyQkFBeUIsT0FBTyxNQUFHO3FCQUM5QztpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDO3dCQUNqQyxRQUFRLEVBQUUsMkJBQXlCLE9BQU8sTUFBRztxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHRvZ2dsZSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vdHJhbnNmb3Jtcy90b2dnbGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdUb2dnbGUgU2VsZWN0aW9uIFRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gIGNvbnN0IHNlbENtcHRzID0gbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwibXVsdGlcIn0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwibXVsdGlcIiwgXCJyZXNvbHZlXCI6IFwidW5pb25cIixcbiAgICAgIFwib25cIjogXCJtb3VzZW92ZXJcIiwgXCJ0b2dnbGVcIjogXCJldmVudC5jdHJsS2V5XCIsIFwiZW5jb2RpbmdzXCI6IFtcInlcIiwgXCJjb2xvclwiXVxuICAgIH0sXG4gICAgXCJ0aHJlZVwiOiB7XCJ0eXBlXCI6IFwibXVsdGlcIiwgXCJ0b2dnbGVcIjogZmFsc2V9LFxuICAgIFwiZm91clwiOiB7XCJ0eXBlXCI6IFwibXVsdGlcIiwgXCJ0b2dnbGVcIjogbnVsbH0sXG4gICAgXCJmaXZlXCI6IHtcInR5cGVcIjogXCJzaW5nbGVcIn0sXG4gICAgXCJzaXhcIjoge1widHlwZVwiOiBcImludGVydmFsXCJ9XG4gIH0pO1xuXG4gIGl0KCdpZGVudGlmaWVzIHRyYW5zZm9ybSBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UodG9nZ2xlLmhhcyhzZWxDbXB0c1snb25lJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh0b2dnbGUuaGFzKHNlbENtcHRzWyd0d28nXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUodG9nZ2xlLmhhcyhzZWxDbXB0c1sndGhyZWUnXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUodG9nZ2xlLmhhcyhzZWxDbXB0c1snZm91ciddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh0b2dnbGUuaGFzKHNlbENtcHRzWydmaXZlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHRvZ2dsZS5oYXMoc2VsQ21wdHNbJ3NpeCddKSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdG9nZ2xlIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvbmVTZyA9IHRvZ2dsZS5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10sIFtdKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKG9uZVNnLCBbe1xuICAgICAgbmFtZTogJ29uZV90b2dnbGUnLFxuICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdHNbJ29uZSddLmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiAnZXZlbnQuc2hpZnRLZXknXG4gICAgICB9XVxuICAgIH1dKTtcblxuICAgIGNvbnN0IHR3b1NnID0gdG9nZ2xlLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSwgW10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnModHdvU2csIFt7XG4gICAgICBuYW1lOiAndHdvX3RvZ2dsZScsXG4gICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0c1sndHdvJ10uZXZlbnRzLFxuICAgICAgICB1cGRhdGU6ICdldmVudC5jdHJsS2V5J1xuICAgICAgfV1cbiAgICB9XSk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIG9uZVNnLmNvbmNhdCh0d29TZykpO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIG1vZGlmeSBleHByJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lRXhwciA9IHRvZ2dsZS5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1snb25lJ10sICcnKTtcbiAgICBhc3NlcnQuZXF1YWwob25lRXhwciwgJ29uZV90b2dnbGUgPyBudWxsIDogb25lX3R1cGxlLCBvbmVfdG9nZ2xlID8gbnVsbCA6IHRydWUsIG9uZV90b2dnbGUgPyBvbmVfdHVwbGUgOiBudWxsJyk7XG5cbiAgICBjb25zdCB0d29FeHByID0gdG9nZ2xlLm1vZGlmeUV4cHIobW9kZWwsIHNlbENtcHRzWyd0d28nXSwgJycpO1xuICAgIGFzc2VydC5lcXVhbCh0d29FeHByLCAndHdvX3RvZ2dsZSA/IG51bGwgOiB0d29fdHVwbGUsIHR3b190b2dnbGUgPyBudWxsIDoge3VuaXQ6IFxcXCJcXFwifSwgdHdvX3RvZ2dsZSA/IHR3b190dXBsZSA6IG51bGwnKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcIm9uZV90dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcIm9uZV9zdG9yZVxcXCIsICR7b25lRXhwcn0pYFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0d29fdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJ0d29fc3RvcmVcXFwiLCAke3R3b0V4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG59KTtcbiJdfQ==
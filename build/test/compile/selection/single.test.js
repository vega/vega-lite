/* tslint:disable quotemark */
import { assert } from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import single from '../../../src/compile/selection/single';
import { parseUnitModelWithScale } from '../../util';
describe('Single Selection', function () {
    var model = parseUnitModelWithScale({
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
        var oneSg = single.signals(model, selCmpts['one']);
        assert.sameDeepMembers(oneSg, [{
                name: 'one_tuple',
                value: {},
                on: [{
                        events: selCmpts['one'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [], fields: [\"_vgsid_\"], values: [datum[\"_vgsid_\"]]} : null",
                        force: true
                    }]
            }]);
        var twoSg = single.signals(model, selCmpts['two']);
        assert.sameDeepMembers(twoSg, [{
                name: 'two_tuple',
                value: {},
                on: [{
                        events: selCmpts['two'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [\"y\", \"color\"], fields: [\"Miles_per_Gallon\", \"Origin\"], values: [[(item().isVoronoi ? datum.datum : datum)[\"bin_maxbins_10_Miles_per_Gallon\"], (item().isVoronoi ? datum.datum : datum)[\"bin_maxbins_10_Miles_per_Gallon_end\"]], (item().isVoronoi ? datum.datum : datum)[\"Origin\"]], \"bin_Miles_per_Gallon\": 1} : null",
                        force: true
                    }]
            }]);
        var signals = selection.assembleUnitSelectionSignals(model, []);
        assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify signals', function () {
        var oneExpr = single.modifyExpr(model, selCmpts['one']);
        assert.equal(oneExpr, 'one_tuple, true');
        var twoExpr = single.modifyExpr(model, selCmpts['two']);
        assert.equal(twoExpr, 'two_tuple, true');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        assert.includeDeepMembers(signals, [
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
        var oneSg = single.topLevelSignals(model, selCmpts['one'], []);
        assert.sameDeepMembers(oneSg, [{
                name: 'one', update: 'data(\"one_store\").length && {_vgsid_: data(\"one_store\")[0].values[0]}'
            }]);
        var twoSg = single.topLevelSignals(model, selCmpts['two'], []);
        assert.sameDeepMembers(twoSg, [{
                name: 'two', update: 'data(\"two_store\").length && {Miles_per_Gallon: data(\"two_store\")[0].values[0], Origin: data(\"two_store\")[0].values[1]}'
            }]);
        var signals = selection.assembleTopLevelSignals(model, []);
        assert.deepEqual(signals, [
            {
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            }
        ].concat(oneSg, twoSg));
    });
    it('builds unit datasets', function () {
        var data = [];
        assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
            { name: 'one_store' }, { name: 'two_store' }
        ]);
    });
    it('leaves marks alone', function () {
        var marks = [];
        model.component.selection = { one: selCmpts['one'] };
        assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUM5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTVCLE9BQU8sS0FBSyxTQUFTLE1BQU0sMENBQTBDLENBQUM7QUFDdEUsT0FBTyxNQUFNLE1BQU0sdUNBQXVDLENBQUM7QUFDM0QsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR25ELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztRQUNwQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztZQUN0RSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQy9FLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUM7UUFDekIsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSTtZQUNqQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7U0FDL0M7S0FDRixDQUFDLENBQUM7SUFFSCxFQUFF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SUFDMUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQgc2luZ2xlIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zaW5nbGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cblxuZGVzY3JpYmUoJ1NpbmdsZSBTZWxlY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImJpblwiOiB0cnVlfSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2VsQ21wdHMgPSBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcInR5cGVcIjogXCJzaW5nbGVcIn0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCIsIFwibmVhcmVzdFwiOiB0cnVlLFxuICAgICAgXCJvblwiOiBcIm1vdXNlb3ZlclwiLCBcImVuY29kaW5nc1wiOiBbXCJ5XCIsIFwiY29sb3JcIl1cbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgdHVwbGUgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZVNnID0gc2luZ2xlLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhvbmVTZywgW3tcbiAgICAgIG5hbWU6ICdvbmVfdHVwbGUnLFxuICAgICAgdmFsdWU6IHt9LFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdHNbJ29uZSddLmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8ge3VuaXQ6IFxcXCJcXFwiLCBlbmNvZGluZ3M6IFtdLCBmaWVsZHM6IFtcXFwiX3Znc2lkX1xcXCJdLCB2YWx1ZXM6IFtkYXR1bVtcXFwiX3Znc2lkX1xcXCJdXX0gOiBudWxsXCIsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dKTtcblxuICAgIGNvbnN0IHR3b1NnID0gc2luZ2xlLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyh0d29TZywgW3tcbiAgICAgIG5hbWU6ICd0d29fdHVwbGUnLFxuICAgICAgdmFsdWU6IHt9LFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdHNbJ3R3byddLmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8ge3VuaXQ6IFxcXCJcXFwiLCBlbmNvZGluZ3M6IFtcXFwieVxcXCIsIFxcXCJjb2xvclxcXCJdLCBmaWVsZHM6IFtcXFwiTWlsZXNfcGVyX0dhbGxvblxcXCIsIFxcXCJPcmlnaW5cXFwiXSwgdmFsdWVzOiBbWyhpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcImJpbl9tYXhiaW5zXzEwX01pbGVzX3Blcl9HYWxsb25cXFwiXSwgKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiYmluX21heGJpbnNfMTBfTWlsZXNfcGVyX0dhbGxvbl9lbmRcXFwiXV0sIChpdGVtKCkuaXNWb3Jvbm9pID8gZGF0dW0uZGF0dW0gOiBkYXR1bSlbXFxcIk9yaWdpblxcXCJdXSwgXFxcImJpbl9NaWxlc19wZXJfR2FsbG9uXFxcIjogMX0gOiBudWxsXCIsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgb25lU2cuY29uY2F0KHR3b1NnKSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgbW9kaWZ5IHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvbmVFeHByID0gc2luZ2xlLm1vZGlmeUV4cHIobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgYXNzZXJ0LmVxdWFsKG9uZUV4cHIsICdvbmVfdHVwbGUsIHRydWUnKTtcblxuICAgIGNvbnN0IHR3b0V4cHIgPSBzaW5nbGUubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICBhc3NlcnQuZXF1YWwodHdvRXhwciwgJ3R3b190dXBsZSwgdHJ1ZScpO1xuXG4gICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9tb2RpZnlcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwib25lX3R1cGxlXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogYG1vZGlmeShcXFwib25lX3N0b3JlXFxcIiwgJHtvbmVFeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0d29fbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInR3b190dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcInR3b19zdG9yZVxcXCIsICR7dHdvRXhwcn0pYFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIHRvcC1sZXZlbCBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lU2cgPSBzaW5nbGUudG9wTGV2ZWxTaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10sIFtdKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKG9uZVNnLCBbe1xuICAgICAgbmFtZTogJ29uZScsIHVwZGF0ZTogJ2RhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiB7X3Znc2lkXzogZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udmFsdWVzWzBdfSdcbiAgICB9XSk7XG5cbiAgICBjb25zdCB0d29TZyA9IHNpbmdsZS50b3BMZXZlbFNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSwgW10pO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnModHdvU2csIFt7XG4gICAgICBuYW1lOiAndHdvJywgdXBkYXRlOiAnZGF0YShcXFwidHdvX3N0b3JlXFxcIikubGVuZ3RoICYmIHtNaWxlc19wZXJfR2FsbG9uOiBkYXRhKFxcXCJ0d29fc3RvcmVcXFwiKVswXS52YWx1ZXNbMF0sIE9yaWdpbjogZGF0YShcXFwidHdvX3N0b3JlXFxcIilbMF0udmFsdWVzWzFdfSdcbiAgICB9XSk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVG9wTGV2ZWxTaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzaWduYWxzLCBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd1bml0JyxcbiAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICBvbjogW3tldmVudHM6ICdtb3VzZW1vdmUnLCB1cGRhdGU6ICdpc1R1cGxlKGdyb3VwKCkpID8gZ3JvdXAoKSA6IHVuaXQnfV1cbiAgICAgIH1cbiAgICBdLmNvbmNhdChvbmVTZywgdHdvU2cpKTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyB1bml0IGRhdGFzZXRzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZGF0YTogYW55W10gPSBbXTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhKG1vZGVsLCBkYXRhKSwgW1xuICAgICAge25hbWU6ICdvbmVfc3RvcmUnfSwge25hbWU6ICd0d29fc3RvcmUnfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnbGVhdmVzIG1hcmtzIGFsb25lJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbWFya3M6IGFueVtdID0gW107XG4gICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtvbmU6IHNlbENtcHRzWydvbmUnXX07XG4gICAgYXNzZXJ0LmVxdWFsKHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyhtb2RlbCwgbWFya3MpLCBtYXJrcyk7XG4gIH0pO1xufSk7XG4iXX0=
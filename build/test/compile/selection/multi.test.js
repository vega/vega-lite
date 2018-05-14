/* tslint:disable quotemark */
import { assert } from 'chai';
import multi from '../../../src/compile/selection/multi';
import * as selection from '../../../src/compile/selection/selection';
import { parseUnitModelWithScale } from '../../util';
describe('Multi Selection', function () {
    var model = parseUnitModelWithScale({
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
        var oneSg = multi.signals(model, selCmpts['one']);
        assert.sameDeepMembers(oneSg, [{
                name: 'one_tuple',
                value: {},
                on: [{
                        events: selCmpts['one'].events,
                        update: "datum && item().mark.marktype !== 'group' ? {unit: \"\", encodings: [], fields: [\"_vgsid_\"], values: [datum[\"_vgsid_\"]]} : null",
                        force: true
                    }]
            }]);
        var twoSg = multi.signals(model, selCmpts['two']);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFDOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEtBQUssTUFBTSxzQ0FBc0MsQ0FBQztBQUN6RCxPQUFPLEtBQUssU0FBUyxNQUFNLDBDQUEwQyxDQUFDO0FBQ3RFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVuRCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUM7UUFDcEMsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7WUFDdEUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDO1FBQ3hCLEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUk7WUFDaEMsSUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7U0FDMUU7S0FDRixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7UUFDekIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULEVBQUUsRUFBRSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTTt3QkFDOUIsTUFBTSxFQUFFLHFJQUFxSTt3QkFDN0ksS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQzthQUNILENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULEVBQUUsRUFBRSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTTt3QkFDOUIsTUFBTSxFQUFFLDZZQUE2WTt3QkFDclosS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQzthQUNILENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtRQUN6QixJQUFNLElBQUksR0FBVSxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3ZFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQztTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtRQUN2QixJQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IG11bHRpIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9tdWx0aSc7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ011bHRpIFNlbGVjdGlvbicsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYmluXCI6IHRydWV9LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBzZWxDbXB0cyA9IG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1widHlwZVwiOiBcIm11bHRpXCJ9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIm11bHRpXCIsIFwibmVhcmVzdFwiOiB0cnVlLFxuICAgICAgXCJvblwiOiBcIm1vdXNlb3ZlclwiLCBcInRvZ2dsZVwiOiBcImV2ZW50LmN0cmxLZXlcIiwgXCJlbmNvZGluZ3NcIjogW1wieVwiLCBcImNvbG9yXCJdXG4gICAgfVxuICB9KTtcblxuICBpdCgnYnVpbGRzIHR1cGxlIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBvbmVTZyA9IG11bHRpLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhvbmVTZywgW3tcbiAgICAgIG5hbWU6ICdvbmVfdHVwbGUnLFxuICAgICAgdmFsdWU6IHt9LFxuICAgICAgb246IFt7XG4gICAgICAgIGV2ZW50czogc2VsQ21wdHNbJ29uZSddLmV2ZW50cyxcbiAgICAgICAgdXBkYXRlOiBcImRhdHVtICYmIGl0ZW0oKS5tYXJrLm1hcmt0eXBlICE9PSAnZ3JvdXAnID8ge3VuaXQ6IFxcXCJcXFwiLCBlbmNvZGluZ3M6IFtdLCBmaWVsZHM6IFtcXFwiX3Znc2lkX1xcXCJdLCB2YWx1ZXM6IFtkYXR1bVtcXFwiX3Znc2lkX1xcXCJdXX0gOiBudWxsXCIsXG4gICAgICAgIGZvcmNlOiB0cnVlXG4gICAgICB9XVxuICAgIH1dKTtcblxuICAgIGNvbnN0IHR3b1NnID0gbXVsdGkuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKHR3b1NnLCBbe1xuICAgICAgbmFtZTogJ3R3b190dXBsZScsXG4gICAgICB2YWx1ZToge30sXG4gICAgICBvbjogW3tcbiAgICAgICAgZXZlbnRzOiBzZWxDbXB0c1sndHdvJ10uZXZlbnRzLFxuICAgICAgICB1cGRhdGU6IFwiZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyB7dW5pdDogXFxcIlxcXCIsIGVuY29kaW5nczogW1xcXCJ5XFxcIiwgXFxcImNvbG9yXFxcIl0sIGZpZWxkczogW1xcXCJNaWxlc19wZXJfR2FsbG9uXFxcIiwgXFxcIk9yaWdpblxcXCJdLCB2YWx1ZXM6IFtbKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiYmluX21heGJpbnNfMTBfTWlsZXNfcGVyX0dhbGxvblxcXCJdLCAoaXRlbSgpLmlzVm9yb25vaSA/IGRhdHVtLmRhdHVtIDogZGF0dW0pW1xcXCJiaW5fbWF4Ymluc18xMF9NaWxlc19wZXJfR2FsbG9uX2VuZFxcXCJdXSwgKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKVtcXFwiT3JpZ2luXFxcIl1dLCBcXFwiYmluX01pbGVzX3Blcl9HYWxsb25cXFwiOiAxfSA6IG51bGxcIixcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH1dXG4gICAgfV0pO1xuXG4gICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBvbmVTZy5jb25jYXQodHdvU2cpKTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyB1bml0IGRhdGFzZXRzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZGF0YTogYW55W10gPSBbXTtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25EYXRhKG1vZGVsLCBkYXRhKSwgW1xuICAgICAge25hbWU6ICdvbmVfc3RvcmUnfSwge25hbWU6ICd0d29fc3RvcmUnfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnbGVhdmVzIG1hcmtzIGFsb25lJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbWFya3M6IGFueVtdID0gW107XG4gICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtvbmU6IHNlbENtcHRzWydvbmUnXX07XG4gICAgYXNzZXJ0LmVxdWFsKHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25NYXJrcyhtb2RlbCwgbWFya3MpLCBtYXJrcyk7XG4gIH0pO1xufSk7XG4iXX0=
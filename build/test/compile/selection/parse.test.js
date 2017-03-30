/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
describe('Selection', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "N" }
        }
    });
    it('parses default selection definitions', function () {
        var component = selection.parseUnitSelection(model, {
            "one": { "type": "single" },
            "two": { "type": "multi" },
            "three": { "type": "interval" }
        });
        chai_1.assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);
        chai_1.assert.deepPropertyVal(component, 'one.name', 'one');
        chai_1.assert.deepPropertyVal(component, 'one.type', 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: '_id', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.shiftKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: '_id', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.deepPropertyVal(component, 'three.translate', '[mousedown, window:mouseup] > window:mousemove!');
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Horsepower', encoding: 'x' }, { field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope'));
    });
    it('supports inline default overrides', function () {
        var component = selection.parseUnitSelection(model, {
            "one": {
                "type": "single",
                "on": "dblclick", "fields": ["Cylinders"]
            },
            "two": {
                "type": "multi",
                "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["color"]
            },
            "three": {
                "type": "interval",
                "on": "[mousedown[!event.shiftKey], mouseup] > mousemove",
                "encodings": ["y"], "translate": false, "zoom": "wheel[event.altKey]"
            }
        });
        chai_1.assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);
        chai_1.assert.deepPropertyVal(component, 'one.name', 'one');
        chai_1.assert.deepPropertyVal(component, 'one.type', 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.deepPropertyVal(component, 'three.translate', false);
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, vega_event_selector_1.selector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
    });
    it('respects selection configs', function () {
        model.config.selection = {
            single: { on: 'dblclick', fields: ['Cylinders'] },
            multi: { on: 'mouseover', encodings: ['color'], toggle: 'event.ctrlKey' },
            interval: {
                on: '[mousedown[!event.shiftKey], mouseup] > mousemove',
                encodings: ['y'],
                zoom: 'wheel[event.altKey]'
            }
        };
        var component = selection.parseUnitSelection(model, {
            "one": { "type": "single" },
            "two": { "type": "multi" },
            "three": { "type": "interval" }
        });
        chai_1.assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);
        chai_1.assert.deepPropertyVal(component, 'one.name', 'one');
        chai_1.assert.deepPropertyVal(component, 'one.type', 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.notDeepProperty(component, 'three.translate');
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, vega_event_selector_1.selector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBQzlELG9FQUFzRTtBQUN0RSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7U0FDMUM7S0FDRixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtZQUNwRCxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDO1lBQ3pCLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7WUFDeEIsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQztTQUM5QixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFcEUsYUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JELGFBQU0s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
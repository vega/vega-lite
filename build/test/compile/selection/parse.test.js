"use strict";
/* tslint:disable quotemark */
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
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: '_id', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.shiftKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: '_id', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert.equal(component.three.translate, '[mousedown, window:mouseup] > window:mousemove!');
        chai_1.assert.equal(component.three.zoom, 'wheel');
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
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert.equal(component.three.translate, false);
        chai_1.assert.equal(component.three.zoom, 'wheel[event.altKey]');
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
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert(!component.three.translate);
        chai_1.assert.equal(component.three.zoom, 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, vega_event_selector_1.selector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vcGFyc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBQzlELG9FQUFzRTtBQUN0RSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7U0FDMUM7S0FDRixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtZQUNwRCxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDO1lBQ3pCLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7WUFDeEIsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQztTQUM5QixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFcEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztR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
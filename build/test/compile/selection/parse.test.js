/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var selection = require("../../../src/compile/selection/selection");
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
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
        chai_1.assert.sameDeepMembers(component['one'].events, event_selector_1.default('click', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.shiftKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: '_id', encoding: null }]);
        chai_1.assert.sameDeepMembers(component['two'].events, event_selector_1.default('click', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.deepPropertyVal(component, 'three.translate', '[mousedown, window:mouseup] > window:mousemove!');
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Horsepower', encoding: 'x' }, { field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, event_selector_1.default('[mousedown, window:mouseup] > window:mousemove!', 'scope'));
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
        chai_1.assert.sameDeepMembers(component['one'].events, event_selector_1.default('dblclick', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, event_selector_1.default('mouseover', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.deepPropertyVal(component, 'three.translate', false);
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, event_selector_1.default('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
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
        chai_1.assert.sameDeepMembers(component['one'].events, event_selector_1.default('dblclick', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'two.name', 'two');
        chai_1.assert.deepPropertyVal(component, 'two.type', 'multi');
        chai_1.assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', encoding: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, event_selector_1.default('mouseover', 'scope'));
        chai_1.assert.deepPropertyVal(component, 'three.name', 'three');
        chai_1.assert.deepPropertyVal(component, 'three.type', 'interval');
        chai_1.assert.notDeepProperty(component, 'three.translate');
        chai_1.assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', encoding: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, event_selector_1.default('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
    });
});
//# sourceMappingURL=parse.test.js.map
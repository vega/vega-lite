"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('Selection', function () {
    var model = util_2.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    it('parses default selection definitions', function () {
        var component = selection.parseUnitSelection(model, {
            "one": { "type": "single" },
            "two": { "type": "multi" },
            "three": { "type": "interval" }
        });
        chai_1.assert.sameMembers(util_1.keys(component), ['one', 'two', 'three']);
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: '_vgsid_', channel: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.shiftKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: '_vgsid_', channel: null }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('click', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert.equal(component.three.translate, '[mousedown, window:mouseup] > window:mousemove!');
        chai_1.assert.equal(component.three.zoom, 'wheel!');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Horsepower', channel: 'x' }, { field: 'Miles_per_Gallon', channel: 'y' }]);
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
        chai_1.assert.sameMembers(util_1.keys(component), ['one', 'two', 'three']);
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', channel: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', channel: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert.equal(component.three.translate, false);
        chai_1.assert.equal(component.three.zoom, 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', channel: 'y' }]);
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
        chai_1.assert.sameMembers(util_1.keys(component), ['one', 'two', 'three']);
        chai_1.assert.equal(component.one.name, 'one');
        chai_1.assert.equal(component.one.type, 'single');
        chai_1.assert.sameDeepMembers(component['one'].project, [{ field: 'Cylinders', channel: null }]);
        chai_1.assert.sameDeepMembers(component['one'].events, vega_event_selector_1.selector('dblclick', 'scope'));
        chai_1.assert.equal(component.two.name, 'two');
        chai_1.assert.equal(component.two.type, 'multi');
        chai_1.assert.equal(component.two.toggle, 'event.ctrlKey');
        chai_1.assert.sameDeepMembers(component['two'].project, [{ field: 'Origin', channel: 'color' }]);
        chai_1.assert.sameDeepMembers(component['two'].events, vega_event_selector_1.selector('mouseover', 'scope'));
        chai_1.assert.equal(component.three.name, 'three');
        chai_1.assert.equal(component.three.type, 'interval');
        chai_1.assert(!component.three.translate);
        chai_1.assert.equal(component.three.zoom, 'wheel[event.altKey]');
        chai_1.assert.sameDeepMembers(component['three'].project, [{ field: 'Miles_per_Gallon', channel: 'y' }]);
        chai_1.assert.sameDeepMembers(component['three'].events, vega_event_selector_1.selector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
    });
});
//# sourceMappingURL=parse.test.js.map
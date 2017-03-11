/* tslint:disable quotemark */

import {assert} from 'chai';
import {selector as parseSelector} from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

describe('Selection', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  it('parses default selection definitions', function() {
    const component = selection.parseUnitSelection(model, {
      "one": {"type": "single"},
      "two": {"type": "multi"},
      "three": {"type": "interval"}
    });

    assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);

    assert.deepPropertyVal(component, 'one.name', 'one');
    assert.deepPropertyVal(component, 'one.type', 'single');
    assert.sameDeepMembers(component['one'].project, [{field: '_id', encoding: null}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('click', 'scope'));

    assert.deepPropertyVal(component, 'two.name', 'two');
    assert.deepPropertyVal(component, 'two.type', 'multi');
    assert.deepPropertyVal(component, 'two.toggle', 'event.shiftKey');
    assert.sameDeepMembers(component['two'].project, [{field: '_id', encoding: null}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('click', 'scope'));

    assert.deepPropertyVal(component, 'three.name', 'three');
    assert.deepPropertyVal(component, 'three.type', 'interval');
    assert.deepPropertyVal(component, 'three.translate', '[mousedown, window:mouseup] > window:mousemove!');
    assert.deepPropertyVal(component, 'three.zoom', 'wheel');
    assert.sameDeepMembers(component['three'].project, [{field: 'Horsepower', encoding: 'x'}, {field: 'Miles_per_Gallon', encoding: 'y'}]);
    assert.sameDeepMembers(component['three'].events, parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope'));
  });

  it('supports inline default overrides', function() {
    const component = selection.parseUnitSelection(model, {
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

    assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);

    assert.deepPropertyVal(component, 'one.name', 'one');
    assert.deepPropertyVal(component, 'one.type', 'single');
    assert.sameDeepMembers(component['one'].project, [{field: 'Cylinders', encoding: null}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('dblclick', 'scope'));

    assert.deepPropertyVal(component, 'two.name', 'two');
    assert.deepPropertyVal(component, 'two.type', 'multi');
    assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
    assert.sameDeepMembers(component['two'].project, [{field: 'Origin', encoding: 'color'}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('mouseover', 'scope'));

    assert.deepPropertyVal(component, 'three.name', 'three');
    assert.deepPropertyVal(component, 'three.type', 'interval');
    assert.deepPropertyVal(component, 'three.translate', false);
    assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
    assert.sameDeepMembers(component['three'].project, [{field: 'Miles_per_Gallon', encoding: 'y'}]);
    assert.sameDeepMembers(component['three'].events, parseSelector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
  });

  it('respects selection configs', function() {
    model.config.selection = {
      single: {on: 'dblclick', fields: ['Cylinders']},
      multi: {on: 'mouseover', encodings: ['color'], toggle: 'event.ctrlKey'},
      interval: {
        on: '[mousedown[!event.shiftKey], mouseup] > mousemove',
        encodings: ['y'],
        zoom: 'wheel[event.altKey]'
      }
    };

    const component = selection.parseUnitSelection(model, {
      "one": {"type": "single"},
      "two": {"type": "multi"},
      "three": {"type": "interval"}
    });

    assert.sameMembers(Object.keys(component), ['one', 'two', 'three']);

    assert.deepPropertyVal(component, 'one.name', 'one');
    assert.deepPropertyVal(component, 'one.type', 'single');
    assert.sameDeepMembers(component['one'].project, [{field: 'Cylinders', encoding: null}]);
    assert.sameDeepMembers(component['one'].events, parseSelector('dblclick', 'scope'));

    assert.deepPropertyVal(component, 'two.name', 'two');
    assert.deepPropertyVal(component, 'two.type', 'multi');
    assert.deepPropertyVal(component, 'two.toggle', 'event.ctrlKey');
    assert.sameDeepMembers(component['two'].project, [{field: 'Origin', encoding: 'color'}]);
    assert.sameDeepMembers(component['two'].events, parseSelector('mouseover', 'scope'));

    assert.deepPropertyVal(component, 'three.name', 'three');
    assert.deepPropertyVal(component, 'three.type', 'interval');
    assert.notDeepProperty(component, 'three.translate');
    assert.deepPropertyVal(component, 'three.zoom', 'wheel[event.altKey]');
    assert.sameDeepMembers(component['three'].project, [{field: 'Miles_per_Gallon', encoding: 'y'}]);
    assert.sameDeepMembers(component['three'].events, parseSelector('[mousedown[!event.shiftKey], mouseup] > mousemove', 'scope'));
  });
});

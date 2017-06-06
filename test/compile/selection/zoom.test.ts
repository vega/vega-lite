/* tslint:disable quotemark */

import {assert} from 'chai';
import {selector as parseSelector} from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import zoom from '../../../src/compile/selection/transforms/zoom';
import {parseUnitModel} from '../../util';

describe('Zoom Selection Transform', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  model.parseScale();
  const selCmpts = selection.parseUnitSelection(model, {
    "one": {
      "type": "single",
      "zoom": true
    },
    "two": {
      "type": "multi",
      "zoom": true
    },
    "three": {
      "type": "interval",
      "zoom": false
    },
    "four": {
      "type": "interval"
    },
    "five": {
      "type": "interval",
      "zoom": "wheel, pinch"
    },
    "six": {
      "type": "interval",
      "bind": "scales"
    }
  });

  it('identifies transform invocation', function() {
    assert.isFalse(zoom.has(selCmpts['one']));
    assert.isFalse(zoom.has(selCmpts['two']));
    assert.isFalse(zoom.has(selCmpts['three']));
    assert.isTrue(zoom.has(selCmpts['four']));
    assert.isTrue(zoom.has(selCmpts['five']));
    assert.isTrue(zoom.has(selCmpts['six']));
  });

  it('builds signals for default invocation', function() {
    model.component.selection = {four: selCmpts['four']};
    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "four_zoom_anchor",
        "on": [
          {
            "events": parseSelector('@four_brush:wheel', 'scope'),
            "update": "{x: x(unit), y: y(unit)}"
          }
        ]
      },
      {
        "name": "four_zoom_delta",
        "on": [
          {
            "events": parseSelector('@four_brush:wheel', 'scope'),
            "force": true,
            "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
          }
        ]
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'four_x')[0].on, [
      {
        "events": {"signal": "four_zoom_delta"},
        "update": "clampRange([four_zoom_anchor.x + (four_x[0] - four_zoom_anchor.x) * four_zoom_delta, four_zoom_anchor.x + (four_x[1] - four_zoom_anchor.x) * four_zoom_delta], 0, unit.width)"
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'four_y')[0].on, [
      {
        "events": {"signal": "four_zoom_delta"},
        "update": "clampRange([four_zoom_anchor.y + (four_y[0] - four_zoom_anchor.y) * four_zoom_delta, four_zoom_anchor.y + (four_y[1] - four_zoom_anchor.y) * four_zoom_delta], 0, unit.height)"
      }
    ]);
  });

  it('builds signals for custom events', function() {
    model.component.selection = {five: selCmpts['five']};
    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "five_zoom_anchor",
        "on": [
          {
            "events": parseSelector('@five_brush:wheel, @five_brush:pinch', 'scope'),
            "update": "{x: x(unit), y: y(unit)}"
          }
        ]
      },
      {
        "name": "five_zoom_delta",
        "on": [
          {
            "events": parseSelector('@five_brush:wheel, @five_brush:pinch', 'scope'),
            "force": true,
            "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
          }
        ]
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'five_x')[0].on, [
      {
        "events": {"signal": "five_zoom_delta"},
        "update": "clampRange([five_zoom_anchor.x + (five_x[0] - five_zoom_anchor.x) * five_zoom_delta, five_zoom_anchor.x + (five_x[1] - five_zoom_anchor.x) * five_zoom_delta], 0, unit.width)"
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'five_y')[0].on, [
      {
        "events": {"signal": "five_zoom_delta"},
        "update": "clampRange([five_zoom_anchor.y + (five_y[0] - five_zoom_anchor.y) * five_zoom_delta, five_zoom_anchor.y + (five_y[1] - five_zoom_anchor.y) * five_zoom_delta], 0, unit.height)"
      }
    ]);
  });

  it('builds signals for scale-bound zoom', function() {
    model.component.selection = {six: selCmpts['six']};
    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "six_zoom_anchor",
        "on": [
          {
            "events": parseSelector('wheel', 'scope'),
            "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
          }
        ]
      },
      {
        "name": "six_zoom_delta",
        "on": [
          {
            "events": parseSelector('wheel', 'scope'),
            "force": true,
            "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
          }
        ]
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Horsepower')[0].on, [
      {
        "events": {"signal": "six_zoom_delta"},
        "update": "[six_zoom_anchor.x + (domain(\"x\")[0] - six_zoom_anchor.x) * six_zoom_delta, six_zoom_anchor.x + (domain(\"x\")[1] - six_zoom_anchor.x) * six_zoom_delta]"
      }
    ]);

    assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on, [
      {
        "events": {"signal": "six_zoom_delta"},
        "update": "[six_zoom_anchor.y + (domain(\"y\")[0] - six_zoom_anchor.y) * six_zoom_delta, six_zoom_anchor.y + (domain(\"y\")[1] - six_zoom_anchor.y) * six_zoom_delta]"
      }
    ]);
  });
});

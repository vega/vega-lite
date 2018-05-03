/* tslint:disable quotemark */

import {assert} from 'chai';
import {selector as parseSelector} from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import zoom from '../../../src/compile/selection/transforms/zoom';
import {ScaleType} from '../../../src/scale';
import {parseUnitModel} from '../../util';

function getModel(xscale?: ScaleType, yscale?: ScaleType) {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative", "scale": {"type": xscale || "linear"}},
      "y": {"field": "Miles_per_Gallon","type": "quantitative", "scale": {"type": yscale || "linear"}},
      "color": {"field": "Origin", "type": "nominal"}
    }
  });

  model.parseScale();
  const selCmpts = selection.parseUnitSelection(model, {
    "one": {
      "type": "single"
    },
    "two": {
      "type": "multi"
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
    },
    "seven": {
      "type": "interval",
      "zoom": null
    }
  });

  return {model, selCmpts};
}

describe('Zoom Selection Transform', () =>  {

  it('identifies transform invocation', () =>  {
    const {model: _model, selCmpts} = getModel();
    assert.isNotTrue(zoom.has(selCmpts['one']));
    assert.isNotTrue(zoom.has(selCmpts['two']));
    assert.isNotTrue(zoom.has(selCmpts['three']));
    assert.isNotFalse(zoom.has(selCmpts['four']));
    assert.isNotFalse(zoom.has(selCmpts['five']));
    assert.isNotFalse(zoom.has(selCmpts['six']));
    assert.isNotTrue(zoom.has(selCmpts['seven']));
  });

  describe('Anchor/Delta signals', () =>  {
    it('builds then for default invocation', () =>  {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      const signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals, [
        {
          "name": "four_zoom_anchor",
          "on": [
            {
              "events": parseSelector('@four_brush:wheel!', 'scope'),
              "update": "{x: x(unit), y: y(unit)}"
            }
          ]
        },
        {
          "name": "four_zoom_delta",
          "on": [
            {
              "events": parseSelector('@four_brush:wheel!', 'scope'),
              "force": true,
              "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
            }
          ]
        }
      ]);
    });

    it('builds them for custom events', () =>  {
      const {model, selCmpts} = getModel();
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
    });

    it('builds them for scale-bound zoom', () =>  {
      const {model, selCmpts} = getModel();
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals, [
        {
          "name": "six_zoom_anchor",
          "on": [
            {
              "events": parseSelector('wheel!', 'scope'),
              "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
            }
          ]
        },
        {
          "name": "six_zoom_delta",
          "on": [
            {
              "events": parseSelector('wheel!', 'scope'),
              "force": true,
              "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
            }
          ]
        }
      ]);
    });
  });

  describe('Zoom Signal', () =>  {
    it('always builds zoomLinear exprs for brushes', () =>  {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      let signals = selection.assembleUnitSelectionSignals(model, []);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'four_x')[0].on, [
        {
          "events": {"signal": "four_zoom_delta"},
          "update": "clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)"
        }
      ]);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'four_y')[0].on, [
        {
          "events": {"signal": "four_zoom_delta"},
          "update": "clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)"
        }
      ]);

      const model2 = getModel('log', 'pow').model;
      model2.component.selection = {four: selCmpts['four']};
      signals = selection.assembleUnitSelectionSignals(model2, []);
      assert.includeDeepMembers(signals.filter((s) => s.name === 'four_x')[0].on, [
        {
          "events": {"signal": "four_zoom_delta"},
          "update": "clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)"
        }
      ]);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'four_y')[0].on, [
        {
          "events": {"signal": "four_zoom_delta"},
          "update": "clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)"
        }
      ]);
    });

    it('builds zoomLinear exprs for scale-bound zoom', () =>  {
      const {model, selCmpts} = getModel();
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Horsepower')[0].on, [
        {
          "events": {"signal": "six_zoom_delta"},
          "update": "zoomLinear(domain(\"x\"), six_zoom_anchor.x, six_zoom_delta)"
        }
      ]);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on, [
        {
          "events": {"signal": "six_zoom_delta"},
          "update": "zoomLinear(domain(\"y\"), six_zoom_anchor.y, six_zoom_delta)"
        }
      ]);
    });

    it('builds zoomLog/Pow exprs for scale-bound zoom', () =>  {
      const {model, selCmpts} = getModel('log', 'pow');
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Horsepower')[0].on, [
        {
          "events": {"signal": "six_zoom_delta"},
          "update": "zoomLog(domain(\"x\"), six_zoom_anchor.x, six_zoom_delta)"
        }
      ]);

      assert.includeDeepMembers(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on, [
        {
          "events": {"signal": "six_zoom_delta"},
          "update": "zoomPow(domain(\"y\"), six_zoom_anchor.y, six_zoom_delta, 1)"
        }
      ]);
    });
  });
});

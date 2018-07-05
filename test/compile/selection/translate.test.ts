/* tslint:disable quotemark */

import {assert} from 'chai';
import {selector as parseSelector} from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import translate from '../../../src/compile/selection/transforms/translate';
import {ScaleType} from '../../../src/scale';
import {parseUnitModel} from '../../util';

function getModel(xscale?: ScaleType, yscale?: ScaleType) {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative', scale: {type: xscale || 'linear'}},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', scale: {type: yscale || 'linear'}},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();
  const selCmpts = selection.parseUnitSelection(model, {
    one: {
      type: 'single'
    },
    two: {
      type: 'multi'
    },
    three: {
      type: 'interval',
      translate: false
    },
    four: {
      type: 'interval'
    },
    five: {
      type: 'interval',
      translate: '[mousedown, mouseup] > mousemove, [keydown, keyup] > touchmove'
    },
    six: {
      type: 'interval',
      bind: 'scales'
    },
    seven: {
      type: 'interval',
      translate: null
    }
  });

  return {model, selCmpts};
}

describe('Translate Selection Transform', () => {
  it('identifies transform invocation', () => {
    const {model: _model, selCmpts} = getModel();
    assert.isNotTrue(translate.has(selCmpts['one']));
    assert.isNotTrue(translate.has(selCmpts['two']));
    assert.isNotTrue(translate.has(selCmpts['three']));
    assert.isNotFalse(translate.has(selCmpts['four']));
    assert.isNotFalse(translate.has(selCmpts['five']));
    assert.isNotFalse(translate.has(selCmpts['six']));
    assert.isNotTrue(translate.has(selCmpts['seven']));
  });

  describe('Anchor/Delta signals', () => {
    const {model, selCmpts} = getModel();

    it('builds them for default invocation', () => {
      model.component.selection = {four: selCmpts['four']};
      const signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals, [
        {
          name: 'four_translate_anchor',
          value: {},
          on: [
            {
              events: parseSelector('@four_brush:mousedown', 'scope'),
              update: '{x: x(unit), y: y(unit), extent_x: slice(four_x), extent_y: slice(four_y)}'
            }
          ]
        },
        {
          name: 'four_translate_delta',
          value: {},
          on: [
            {
              events: parseSelector('[@four_brush:mousedown, window:mouseup] > window:mousemove!', 'scope'),
              update: '{x: four_translate_anchor.x - x(unit), y: four_translate_anchor.y - y(unit)}'
            }
          ]
        }
      ]);
    });

    it('builds them for custom events', () => {
      model.component.selection = {five: selCmpts['five']};
      const signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals, [
        {
          name: 'five_translate_anchor',
          value: {},
          on: [
            {
              events: parseSelector('@five_brush:mousedown, @five_brush:keydown', 'scope'),
              update: '{x: x(unit), y: y(unit), extent_x: slice(five_x), extent_y: slice(five_y)}'
            }
          ]
        },
        {
          name: 'five_translate_delta',
          value: {},
          on: [
            {
              events: parseSelector(
                '[@five_brush:mousedown, mouseup] > mousemove, [@five_brush:keydown, keyup] > touchmove',
                'scope'
              ),
              update: '{x: five_translate_anchor.x - x(unit), y: five_translate_anchor.y - y(unit)}'
            }
          ]
        }
      ]);
    });

    it('builds them for scale-bound intervals', () => {
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals, [
        {
          name: 'six_translate_anchor',
          value: {},
          on: [
            {
              events: parseSelector('mousedown', 'scope'),
              update: '{x: x(unit), y: y(unit), extent_x: domain("x"), extent_y: domain("y")}'
            }
          ]
        },
        {
          name: 'six_translate_delta',
          value: {},
          on: [
            {
              events: parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope'),
              update: '{x: six_translate_anchor.x - x(unit), y: six_translate_anchor.y - y(unit)}'
            }
          ]
        }
      ]);
    });
  });

  describe('Translate Signal', () => {
    it('always builds panLinear exprs for brushes', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      let signals = selection.assembleUnitSelectionSignals(model, []);
      assert.includeDeepMembers(signals.filter(s => s.name === 'four_x')[0].on, [
        {
          events: {signal: 'four_translate_delta'},
          update:
            'clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)'
        }
      ]);

      assert.includeDeepMembers(signals.filter(s => s.name === 'four_y')[0].on, [
        {
          events: {signal: 'four_translate_delta'},
          update:
            'clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)'
        }
      ]);

      const model2 = getModel('log', 'pow').model;
      model2.component.selection = {four: selCmpts['four']};
      signals = selection.assembleUnitSelectionSignals(model2, []);
      assert.includeDeepMembers(signals.filter(s => s.name === 'four_x')[0].on, [
        {
          events: {signal: 'four_translate_delta'},
          update:
            'clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)'
        }
      ]);

      assert.includeDeepMembers(signals.filter(s => s.name === 'four_y')[0].on, [
        {
          events: {signal: 'four_translate_delta'},
          update:
            'clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)'
        }
      ]);
    });

    it('builds panLinear exprs for scale-bound intervals', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);

      assert.includeDeepMembers(signals.filter(s => s.name === 'six_Horsepower')[0].on, [
        {
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_x, -six_translate_delta.x / width)'
        }
      ]);

      assert.includeDeepMembers(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on, [
        {
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_y, six_translate_delta.y / height)'
        }
      ]);
    });

    it('builds panLog/panPow exprs for scale-bound intervals', () => {
      const {model, selCmpts} = getModel('log', 'pow');
      model.component.selection = {six: selCmpts['six']};
      const signals = selection.assembleUnitSelectionSignals(model, []);

      assert.includeDeepMembers(signals.filter(s => s.name === 'six_Horsepower')[0].on, [
        {
          events: {signal: 'six_translate_delta'},
          update: 'panLog(six_translate_anchor.extent_x, -six_translate_delta.x / width)'
        }
      ]);

      assert.includeDeepMembers(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on, [
        {
          events: {signal: 'six_translate_delta'},
          update: 'panPow(six_translate_anchor.extent_y, six_translate_delta.y / height, 1)'
        }
      ]);
    });
  });
});

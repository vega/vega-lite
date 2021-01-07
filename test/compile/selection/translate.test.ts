import {selector as parseSelector} from 'vega-event-selector';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import translate from '../../../src/compile/selection/translate';
import {Scale} from '../../../src/scale';
import {Sort} from '../../../src/sort';
import {parseUnitModel} from '../../util';

function getModel(
  xscale: Scale = {type: 'linear'},
  yscale: Scale = {type: 'linear'},
  xsort?: Sort<string>,
  ysort?: Sort<string>
) {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative', scale: xscale, ...(xsort ? {sort: xsort} : {})},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', scale: yscale, ...(ysort ? {sort: ysort} : {})},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();
  const selCmpts = parseUnitSelection(model, [
    {
      name: 'one',
      select: {
        type: 'point'
      }
    },
    {
      name: 'three',
      select: {
        type: 'interval',
        translate: false
      }
    },
    {
      name: 'four',
      select: {
        type: 'interval'
      }
    },
    {
      name: 'five',
      select: {
        type: 'interval',
        translate: '[mousedown, mouseup] > mousemove, [keydown, keyup] > touchmove'
      }
    },
    {
      name: 'six',
      select: {
        type: 'interval'
      },
      bind: 'scales'
    },
    {
      name: 'seven',
      select: {
        type: 'interval',
        translate: null
      }
    }
  ]);

  return {model, selCmpts};
}

describe('Translate Selection Transform', () => {
  it('identifies transform invocation', () => {
    const {selCmpts} = getModel();
    expect(translate.defined(selCmpts['one'])).not.toBe(true);
    expect(translate.defined(selCmpts['three'])).not.toBe(true);
    expect(translate.defined(selCmpts['four'])).not.toBe(false);
    expect(translate.defined(selCmpts['five'])).not.toBe(false);
    expect(translate.defined(selCmpts['six'])).not.toBe(false);
    expect(translate.defined(selCmpts['seven'])).not.toBe(true);
  });

  describe('Anchor/Delta signals', () => {
    const {model, selCmpts} = getModel();

    it('builds them for default invocation', () => {
      model.component.selection = {four: selCmpts['four']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
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
        ])
      );
    });

    it('builds them for custom events', () => {
      model.component.selection = {five: selCmpts['five']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
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
        ])
      );
    });

    it('builds them for scale-bound intervals', () => {
      model.component.selection = {six: selCmpts['six']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
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
        ])
      );
    });
  });

  describe('Translate Signal', () => {
    it('always builds panLinear exprs for brushes', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      let signals = assembleUnitSelectionSignals(model, []);
      expect(signals.filter(s => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_translate_delta'},
        update:
          'clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)'
      });

      expect(signals.filter(s => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_translate_delta'},
        update:
          'clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)'
      });

      const model2 = getModel({type: 'log'}, {type: 'pow'}).model;
      model2.component.selection = {four: selCmpts['four']};
      signals = assembleUnitSelectionSignals(model2, []);
      expect(signals.filter(s => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_translate_delta'},
        update:
          'clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)'
      });

      expect(signals.filter(s => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_translate_delta'},
        update:
          'clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)'
      });
    });

    describe('scale-bound intervals', () => {
      it('builds panLinear exprs', () => {
        const {model, selCmpts} = getModel();
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_x, -six_translate_delta.x / width)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_y, six_translate_delta.y / height)'
        });
      });

      it('builds panLog exprs', () => {
        const {model, selCmpts} = getModel({type: 'log'});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLog(six_translate_anchor.extent_x, -six_translate_delta.x / width)'
        });
      });

      it('builds panSymlog exprs', () => {
        const {model, selCmpts} = getModel({type: 'symlog'}, {type: 'symlog', constant: 0.5});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panSymlog(six_translate_anchor.extent_x, -six_translate_delta.x / width, 1)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panSymlog(six_translate_anchor.extent_y, six_translate_delta.y / height, 0.5)'
        });
      });

      it('builds panPow exprs', () => {
        const {model, selCmpts} = getModel({type: 'pow'}, {type: 'pow', exponent: 2});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panPow(six_translate_anchor.extent_x, -six_translate_delta.x / width, 1)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panPow(six_translate_anchor.extent_y, six_translate_delta.y / height, 2)'
        });
      });

      it('respects reversals', () => {
        let {model, selCmpts} = getModel({type: 'linear', reverse: true}, {type: 'linear', reverse: true});
        model.component.selection = {six: selCmpts['six']};
        let signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_x, six_translate_delta.x / width)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_y, -six_translate_delta.y / height)'
        });

        ({model, selCmpts} = getModel({type: 'linear'}, {type: 'linear'}, 'descending', 'descending'));
        model.component.selection = {six: selCmpts['six']};
        signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_x, six_translate_delta.x / width)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_translate_delta'},
          update: 'panLinear(six_translate_anchor.extent_y, -six_translate_delta.y / height)'
        });
      });
    });
  });
});

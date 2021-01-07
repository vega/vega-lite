import {selector as parseSelector} from 'vega-event-selector';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import zoom from '../../../src/compile/selection/zoom';
import {Scale} from '../../../src/scale';
import {parseUnitModel} from '../../util';

function getModel(xscale: Scale = {type: 'linear'}, yscale: Scale = {type: 'linear'}) {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative', scale: xscale},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', scale: yscale},
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
        zoom: false
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
        zoom: 'wheel, pinch'
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
        zoom: null
      }
    }
  ]);

  return {model, selCmpts};
}

describe('Zoom Selection Transform', () => {
  it('identifies transform invocation', () => {
    const {selCmpts} = getModel();
    expect(zoom.defined(selCmpts['one'])).not.toBe(true);
    expect(zoom.defined(selCmpts['three'])).not.toBe(true);
    expect(zoom.defined(selCmpts['four'])).not.toBe(false);
    expect(zoom.defined(selCmpts['five'])).not.toBe(false);
    expect(zoom.defined(selCmpts['six'])).not.toBe(false);
    expect(zoom.defined(selCmpts['seven'])).not.toBe(true);
  });

  describe('Anchor/Delta signals', () => {
    it('builds then for default invocation', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
          {
            name: 'four_zoom_anchor',
            on: [
              {
                events: parseSelector('@four_brush:wheel!', 'scope'),
                update: '{x: x(unit), y: y(unit)}'
              }
            ]
          },
          {
            name: 'four_zoom_delta',
            on: [
              {
                events: parseSelector('@four_brush:wheel!', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
              }
            ]
          }
        ])
      );
    });

    it('builds them for custom events', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {five: selCmpts['five']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
          {
            name: 'five_zoom_anchor',
            on: [
              {
                events: parseSelector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                update: '{x: x(unit), y: y(unit)}'
              }
            ]
          },
          {
            name: 'five_zoom_delta',
            on: [
              {
                events: parseSelector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
              }
            ]
          }
        ])
      );
    });

    it('builds them for scale-bound zoom', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {six: selCmpts['six']};
      const signals = assembleUnitSelectionSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
          {
            name: 'six_zoom_anchor',
            on: [
              {
                events: parseSelector('wheel!', 'scope'),
                update: '{x: invert("x", x(unit)), y: invert("y", y(unit))}'
              }
            ]
          },
          {
            name: 'six_zoom_delta',
            on: [
              {
                events: parseSelector('wheel!', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
              }
            ]
          }
        ])
      );
    });
  });

  describe('Zoom Signal', () => {
    it('always builds zoomLinear exprs for brushes', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      let signals = assembleUnitSelectionSignals(model, []);

      expect(signals.filter(s => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)'
      });

      expect(signals.filter(s => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)'
      });

      const model2 = getModel({type: 'log'}, {type: 'pow'}).model;
      model2.component.selection = {four: selCmpts['four']};
      signals = assembleUnitSelectionSignals(model2, []);
      expect(signals.filter(s => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)'
      });

      expect(signals.filter(s => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)'
      });
    });

    describe('scale-bound intervals', () => {
      it('builds zoomLinear exprs', () => {
        const {model, selCmpts} = getModel();
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLinear(domain("x"), six_zoom_anchor.x, six_zoom_delta)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLinear(domain("y"), six_zoom_anchor.y, six_zoom_delta)'
        });
      });

      it('builds zoomLog exprs', () => {
        const {model, selCmpts} = getModel({type: 'log'});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLog(domain("x"), six_zoom_anchor.x, six_zoom_delta)'
        });
      });

      it('builds zoomSymlog exprs', () => {
        const {model, selCmpts} = getModel({type: 'symlog'}, {type: 'symlog', constant: 0.5});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomSymlog(domain("x"), six_zoom_anchor.x, six_zoom_delta, 1)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomSymlog(domain("y"), six_zoom_anchor.y, six_zoom_delta, 0.5)'
        });
      });

      it('builds zoomPow exprs', () => {
        const {model, selCmpts} = getModel({type: 'pow'}, {type: 'pow', exponent: 2});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter(s => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomPow(domain("x"), six_zoom_anchor.x, six_zoom_delta, 1)'
        });

        expect(signals.filter(s => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomPow(domain("y"), six_zoom_anchor.y, six_zoom_delta, 2)'
        });
      });
    });
  });
});

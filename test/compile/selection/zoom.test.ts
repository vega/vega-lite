import {parseSelector} from 'vega-event-selector';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble.js';
import {parseUnitSelection} from '../../../src/compile/selection/parse.js';
import zoom from '../../../src/compile/selection/zoom.js';
import {Scale} from '../../../src/scale.js';
import {parseUnitModel} from '../../util.js';

function getModel(xscale: Scale = {type: 'linear'}, yscale: Scale = {type: 'linear'}) {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative', scale: xscale},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', scale: yscale},
      color: {field: 'Origin', type: 'nominal'},
    },
  });

  model.parseScale();
  const selCmpts = parseUnitSelection(model, [
    {
      name: 'one',
      select: {
        type: 'point',
      },
    },
    {
      name: 'three',
      select: {
        type: 'interval',
        zoom: false,
      },
    },
    {
      name: 'four',
      select: {
        type: 'interval',
      },
    },
    {
      name: 'five',
      select: {
        type: 'interval',
        zoom: 'wheel, pinch',
      },
    },
    {
      name: 'six',
      select: {
        type: 'interval',
      },
      bind: 'scales',
    },
    {
      name: 'seven',
      select: {
        type: 'interval',
        zoom: null,
      },
    },
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
                update: '{x: x(unit), y: y(unit)}',
              },
            ],
          },
          {
            name: 'four_zoom_delta',
            on: [
              {
                events: parseSelector('@four_brush:wheel!', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))',
              },
            ],
          },
        ]),
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
                update: '{x: x(unit), y: y(unit)}',
              },
            ],
          },
          {
            name: 'five_zoom_delta',
            on: [
              {
                events: parseSelector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))',
              },
            ],
          },
        ]),
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
                update: '{x: invert("x", x(unit)), y: invert("y", y(unit))}',
              },
            ],
          },
          {
            name: 'six_zoom_delta',
            on: [
              {
                events: parseSelector('wheel!', 'scope'),
                force: true,
                update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))',
              },
            ],
          },
        ]),
      );
    });
  });

  describe('Zoom Signal', () => {
    it('always builds zoomLinear exprs for brushes', () => {
      const {model, selCmpts} = getModel();
      model.component.selection = {four: selCmpts['four']};
      let signals = assembleUnitSelectionSignals(model, []);

      expect(signals.filter((s) => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)',
      });

      expect(signals.filter((s) => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)',
      });

      const model2 = getModel({type: 'log'}, {type: 'pow'}).model;
      model2.component.selection = {four: selCmpts['four']};
      signals = assembleUnitSelectionSignals(model2, []);
      expect(signals.filter((s) => s.name === 'four_x')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)',
      });

      expect(signals.filter((s) => s.name === 'four_y')[0].on).toContainEqual({
        events: {signal: 'four_zoom_delta'},
        update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)',
      });
    });

    describe('scale-bound intervals', () => {
      it('builds zoomLinear exprs', () => {
        const {model, selCmpts} = getModel();
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter((s) => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLinear(domain("x"), six_zoom_anchor.x, six_zoom_delta)',
        });

        expect(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLinear(domain("y"), six_zoom_anchor.y, six_zoom_delta)',
        });
      });

      it('builds zoomLog exprs', () => {
        const {model, selCmpts} = getModel({type: 'log'});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter((s) => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomLog(domain("x"), six_zoom_anchor.x, six_zoom_delta)',
        });
      });

      it('builds zoomSymlog exprs', () => {
        const {model, selCmpts} = getModel({type: 'symlog'}, {type: 'symlog', constant: 0.5});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter((s) => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomSymlog(domain("x"), six_zoom_anchor.x, six_zoom_delta, 1)',
        });

        expect(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomSymlog(domain("y"), six_zoom_anchor.y, six_zoom_delta, 0.5)',
        });
      });

      it('builds zoomPow exprs', () => {
        const {model, selCmpts} = getModel({type: 'pow'}, {type: 'pow', exponent: 2});
        model.component.selection = {six: selCmpts['six']};
        const signals = assembleUnitSelectionSignals(model, []);

        expect(signals.filter((s) => s.name === 'six_Horsepower')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomPow(domain("x"), six_zoom_anchor.x, six_zoom_delta, 1)',
        });

        expect(signals.filter((s) => s.name === 'six_Miles_per_Gallon')[0].on).toContainEqual({
          events: {signal: 'six_zoom_delta'},
          update: 'zoomPow(domain("y"), six_zoom_anchor.y, six_zoom_delta, 2)',
        });
      });
    });
  });

  describe('projection-bound intervals', () => {
    it('builds projection zoom updates', () => {
      const model = parseUnitModel({
        mark: 'circle',
        projection: {type: 'albersUsa'},
        encoding: {
          longitude: {field: 'longitude', type: 'quantitative'},
          latitude: {field: 'latitude', type: 'quantitative'},
        },
        params: [{name: 'geo', select: {type: 'interval'}, bind: 'scales'}],
      });

      model.parseScale();
      model.component.selection = parseUnitSelection(model, model.selection);
      model.parseProjection();

      const signals = assembleUnitSelectionSignals(model, []);
      const anchor: any = signals.find((s) => s.name === 'geo_zoom_anchor');
      expect(anchor.value).toEqual({x: 0, y: 0, scale: 1, translate: [0, 0]});
      expect(anchor.on).toEqual([
        {
          events: parseSelector('wheel!', 'scope'),
          update: '{x: x(unit), y: y(unit), scale: geoScale("projection"), translate: geo_projection_translate}',
        },
      ]);

      const scale: any = signals.find((s) => s.name === 'geo_projection_scale');
      expect(scale.value).toBe(1);
      expect(scale.on).toEqual(
        expect.arrayContaining([
          {
            events: {signal: 'geo_zoom_delta'},
            update: 'geo_zoom_anchor.scale / geo_zoom_delta',
          },
        ]),
      );

      const translate: any = signals.find((s) => s.name === 'geo_projection_translate');
      expect(translate.value).toEqual([0, 0]);
      expect(translate.update).toBe('[width / 2, height / 2]');
      expect(translate.on).toEqual(
        expect.arrayContaining([
          {
            events: {signal: 'geo_zoom_delta'},
            update:
              '[geo_zoom_anchor.x + (geo_zoom_anchor.translate[0] - geo_zoom_anchor.x) / geo_zoom_delta, geo_zoom_anchor.y + (geo_zoom_anchor.translate[1] - geo_zoom_anchor.y) / geo_zoom_delta]',
          },
        ]),
      );

      const fit: any = signals.find((s) => s.name === 'geo_projection_fit');
      expect(fit.init).toBe('geojson_0');
      expect(fit.on).toEqual(
        expect.arrayContaining([
          {
            events: parseSelector('wheel!', 'scope'),
            update: 'null',
          },
        ]),
      );
    });
  });
});

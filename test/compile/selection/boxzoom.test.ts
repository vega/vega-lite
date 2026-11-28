import {parseSelector} from 'vega-event-selector';
import boxZoom from '../../../src/compile/selection/boxzoom.js';
import {assembleScalesForModel} from '../../../src/compile/scale/assemble.js';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble.js';
import interval from '../../../src/compile/selection/interval.js';
import {parseUnitSelection} from '../../../src/compile/selection/parse.js';
import * as log from '../../../src/log/index.js';
import {parseUnitModel, parseUnitModelWithScaleAndSelection} from '../../util.js';

function getModel() {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'},
    },
  });

  model.parseScale();
  const selCmpts = parseUnitSelection(model, [
    {name: 'one', select: {type: 'point'}},
    {name: 'two', select: {type: 'interval'}},
    {name: 'three', select: {type: 'interval', boxZoom: true}},
    {name: 'four', select: {type: 'interval', boxZoom: true}, bind: 'scales'},
    {name: 'five', select: {type: 'interval', boxZoom: true, clear: false}},
  ]);

  return {model, selCmpts};
}

describe('Box Zoom Selection Transform', () => {
  it('identifies transform invocation', () => {
    const {selCmpts} = getModel();
    expect(boxZoom.defined(selCmpts['one'])).toBe(false); // point selections don't apply
    expect(boxZoom.defined(selCmpts['two'])).toBe(false); // boxZoom not set
    expect(boxZoom.defined(selCmpts['three'])).toBe(true);
    expect(boxZoom.defined(selCmpts['four'])).toBe(false); // bind: scales takes precedence
  });

  it('commits the drag extent to the domain on release, and resets on clear', () => {
    const {model, selCmpts} = getModel();
    model.component.selection = {three: selCmpts['three']};
    const signals = assembleUnitSelectionSignals(model, []);

    expect(signals).toContainEqual({
      name: 'three_Horsepower_zoom',
      value: null,
      on: [
        {
          events: parseSelector('window:pointerup', 'scope'),
          update:
            'isValid(three_Horsepower) ? (three_Horsepower[0] < three_Horsepower[1] ? three_Horsepower : [three_Horsepower[1], three_Horsepower[0]]) : three_Horsepower_zoom',
        },
        {events: parseSelector('dblclick', 'view'), update: 'null'},
      ],
    });

    expect(signals).toContainEqual({
      name: 'three_Miles_per_Gallon_zoom',
      value: null,
      on: [
        {
          events: parseSelector('window:pointerup', 'scope'),
          update:
            'isValid(three_Miles_per_Gallon) ? (three_Miles_per_Gallon[0] < three_Miles_per_Gallon[1] ? three_Miles_per_Gallon : [three_Miles_per_Gallon[1], three_Miles_per_Gallon[0]]) : three_Miles_per_Gallon_zoom',
        },
        {events: parseSelector('dblclick', 'view'), update: 'null'},
      ],
    });
  });

  it('omits the clear trigger when clear is disabled', () => {
    const {model, selCmpts} = getModel();
    model.component.selection = {five: selCmpts['five']};
    const signals = assembleUnitSelectionSignals(model, []);
    const commit = signals.find((s) => s.name === 'five_Horsepower_zoom') as any;
    expect(commit.on).toHaveLength(1);
  });

  it('wires the commit signal into the scale as domainRaw', () => {
    const model = parseUnitModelWithScaleAndSelection({
      data: {url: 'data/cars.json'},
      params: [{name: 'grid', select: {type: 'interval', boxZoom: true}}],
      mark: 'circle',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      },
    });

    const scales = assembleScalesForModel(model);
    const [xscale, yscale] = scales;
    expect(xscale.domainRaw).toEqual({signal: 'grid_Horsepower_zoom'});
    expect(yscale.domainRaw).toEqual({signal: 'grid_Miles_per_Gallon_zoom'});
  });

  it('keys the commit signal by field, not just channel, so repeated cells sharing a channel but not a field stay independent', () => {
    const model = parseUnitModelWithScaleAndSelection({
      data: {url: 'data/cars.json'},
      params: [{name: 'grid', select: {type: 'interval', boxZoom: true}}],
      mark: 'circle',
      encoding: {
        x: {field: 'Displacement', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      },
    });

    const scales = assembleScalesForModel(model);
    // A different x field must produce a differently-named commit signal
    // than the 'Horsepower' case above -- otherwise two repeated cells
    // projecting different x fields through the same 'grid'/'x' selection
    // would collide onto one shared signal (see the comment in boxzoom.ts).
    expect(scales[0].domainRaw).toEqual({signal: 'grid_Displacement_zoom'});
  });

  it(
    'warns and skips non-continuous scales',
    log.wrap((localLogger) => {
      parseUnitModelWithScaleAndSelection({
        data: {url: 'data/cars.json'},
        params: [{name: 'grid', select: {type: 'interval', boxZoom: true}}],
        mark: 'circle',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        },
      });
      expect(localLogger.warns[0]).toEqual(log.message.SCALE_BINDINGS_CONTINUOUS);
    }),
  );

  it(
    'warns and no-ops for geographic (projected) views',
    log.wrap((localLogger) => {
      const model = parseUnitModelWithScaleAndSelection({
        data: {url: 'data/airports.csv'},
        params: [{name: 'grid', select: {type: 'interval', encodings: ['longitude', 'latitude'], boxZoom: true}}],
        mark: 'circle',
        encoding: {
          longitude: {field: 'longitude', type: 'quantitative'},
          latitude: {field: 'latitude', type: 'quantitative'},
        },
      });
      expect(localLogger.warns).toContainEqual(log.message.BOX_ZOOM_NOT_SUPPORTED_FOR_PROJECTION);
      expect(model.component.selection['grid'].scales).toBeUndefined();
    }),
  );

  it.each(['union', 'intersect'] as const)('warns and no-ops when resolve is "%s" instead of "global"', (resolve) =>
    log.wrap((localLogger) => {
      const model = parseUnitModelWithScaleAndSelection({
        data: {url: 'data/cars.json'},
        params: [{name: 'grid', select: {type: 'interval', resolve, boxZoom: true}}],
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        },
      });
      expect(localLogger.warns).toContainEqual(log.message.BOX_ZOOM_REQUIRES_GLOBAL_RESOLVE);
      expect(model.component.selection['grid'].scales).toBeUndefined();

      const scales = assembleScalesForModel(model);
      expect(scales[0].domainRaw).toBeUndefined();
    })(),
  );

  describe('brush auto-clear (interval SCALE_TRIGGER override)', () => {
    it('always resets to [0, 0] for boxZoom brushes, unlike a plain interval', () => {
      const {model, selCmpts} = getModel();

      const plain = interval.signals(model, selCmpts['two'], []);
      expect(plain.find((s) => s.name === 'two_x').on).toContainEqual({
        events: {signal: 'two_scale_trigger'},
        update: '[scale("x", two_Horsepower[0]), scale("x", two_Horsepower[1])]',
      });

      const boxZoomSignals = interval.signals(model, selCmpts['three'], []);
      expect(boxZoomSignals.find((s) => s.name === 'three_x').on).toContainEqual({
        events: {signal: 'three_scale_trigger'},
        update: '[0, 0]',
      });
    });
  });
});

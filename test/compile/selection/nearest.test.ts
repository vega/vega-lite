/* tslint:disable quotemark */

import {tooltip} from '../../../src/compile/mark/mixins';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import nearest from '../../../src/compile/selection/transforms/nearest';
import * as log from '../../../src/log';
import {duplicate} from '../../../src/util';
import {VgEncodeEntry} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

function getModel(markType: any) {
  const model = parseUnitModel({
    mark: markType,
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'}
    }
  });
  model.parseScale();
  model.parseMarkGroup();
  model.component.selection = parseUnitSelection(model, {
    one: {type: 'single', nearest: true},
    two: {type: 'multi', nearest: true},
    three: {type: 'interval'},
    four: {type: 'single', nearest: false},
    five: {type: 'multi'},
    six: {type: 'multi', nearest: null},
    seven: {type: 'single', nearest: true, encodings: ['x']},
    eight: {type: 'single', nearest: true, encodings: ['y']},
    nine: {type: 'single', nearest: true, encodings: ['color']},

    singleNearestOnMouseover: {type: 'single', nearest: true, on: 'mouseover'},
    multiNearestOnMouseover: {type: 'multi', nearest: true, on: 'mouseover'}
  });

  return model;
}

function voronoiMark(x?: string | {expr: string}, y?: string | {expr: string}, tooltipEncode: VgEncodeEntry = {}) {
  return [
    {hello: 'world'},
    {
      name: 'voronoi',
      type: 'path',
      from: {data: 'marks'},
      encode: {
        update: {
          fill: {value: 'transparent'},
          strokeWidth: {value: 0.35},
          stroke: {value: 'transparent'},
          isVoronoi: {value: true},
          ...tooltipEncode
        }
      },
      transform: [
        {
          type: 'voronoi',
          x: x || {expr: 'datum.datum.x || 0'},
          y: y || {expr: 'datum.datum.y || 0'},
          size: [{signal: 'width'}, {signal: 'height'}]
        }
      ]
    }
  ];
}

describe('Nearest Selection Transform', () => {
  it('identifies transform invocation', () => {
    const selCmpts = getModel('circle').component.selection;
    expect(nearest.has(selCmpts['one'])).not.toBe(false);
    expect(nearest.has(selCmpts['two'])).not.toBe(false);
    expect(nearest.has(selCmpts['three'])).not.toBe(true);
    expect(nearest.has(selCmpts['four'])).not.toBe(true);
    expect(nearest.has(selCmpts['five'])).not.toBe(true);
    expect(nearest.has(selCmpts['six'])).not.toBe(true);
  });

  it('adds voronoi with tooltip for non-path marks', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];
    const nearestMarks = nearest.marks(model, selCmpts['one'], marks);
    expect(nearestMarks).toMatchObject(voronoiMark(null, null, tooltip(model, {reactiveGeom: true})));
  });

  it(
    'should warn for path marks',
    log.wrap(localLogger => {
      const model = getModel('line');
      const selCmpts = model.component.selection;
      const marks: any[] = [];
      expect(nearest.marks(model, selCmpts['one'], marks)).toEqual(marks);
      expect(localLogger.warns[0]).toEqual(log.message.nearestNotSupportForContinuous('line'));
    })
  );

  it('limits to a single voronoi per unit', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];

    const marks2 = nearest.marks(model, selCmpts['one'], marks);
    expect(nearest.marks(model, selCmpts['two'], marks2)).toMatchObject(voronoiMark());
  });

  it('supports 1D voronoi', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];

    expect(nearest.marks(model, selCmpts['seven'], duplicate(marks))).toMatchObject(voronoiMark(null, {expr: '0'}));

    expect(nearest.marks(model, selCmpts['eight'], duplicate(marks))).toMatchObject(voronoiMark({expr: '0'}));

    expect(nearest.marks(model, selCmpts['nine'], duplicate(marks))).toMatchObject(voronoiMark());
  });
});

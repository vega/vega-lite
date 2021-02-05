import {tooltip} from '../../../src/compile/mark/encode';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import nearest from '../../../src/compile/selection/nearest';
import * as log from '../../../src/log';
import {duplicate} from '../../../src/util';
import {VgEncodeEntry} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';
import {SelectionComponent} from '../../../src/compile/selection';

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
  model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'point', nearest: true}
    },
    {
      name: 'two',
      select: {type: 'point', nearest: true}
    },
    {
      name: 'three',
      select: {type: 'interval'}
    },
    {
      name: 'four',
      select: {type: 'point', nearest: false}
    },
    {
      name: 'five',
      select: {type: 'point'}
    },
    {
      name: 'six',
      select: {type: 'point', nearest: null}
    },
    {
      name: 'seven',
      select: {type: 'point', nearest: true, encodings: ['x']}
    },
    {
      name: 'eight',
      select: {type: 'point', nearest: true, encodings: ['y']}
    },
    {
      name: 'nine',
      select: {type: 'point', nearest: true, encodings: ['color']}
    },
    {
      name: 'ten',
      select: {type: 'point', nearest: true, on: 'mouseover'}
    },
    {
      name: 'eleven',
      select: {type: 'point', nearest: true, on: 'mouseover, dblclick'}
    }
  ]);
  model.parseMarkGroup();

  return model;
}

function voronoiMark(x?: string | {expr: string}, y?: string | {expr: string}, tooltipEncode: VgEncodeEntry = {}) {
  return [
    {hello: 'world'},
    {
      name: 'voronoi',
      type: 'path',
      interactive: true,
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
          x: x ?? {expr: 'datum.datum.x || 0'},
          y: y ?? {expr: 'datum.datum.y || 0'},
          size: [{signal: 'width'}, {signal: 'height'}]
        }
      ]
    }
  ];
}

describe('Nearest Selection Transform', () => {
  it('identifies transform invocation', () => {
    const selCmpts = getModel('circle').component.selection;
    expect(nearest.defined(selCmpts['one'])).not.toBe(false);
    expect(nearest.defined(selCmpts['two'])).not.toBe(false);
    expect(nearest.defined(selCmpts['three'])).not.toBe(true);
    expect(nearest.defined(selCmpts['four'])).not.toBe(true);
    expect(nearest.defined(selCmpts['five'])).not.toBe(true);
    expect(nearest.defined(selCmpts['six'])).not.toBe(true);
  });

  it('scopes events to the voronoi mark', () => {
    const selCmpts = getModel('circle').component.selection;
    expect(selCmpts['one'].events).toEqual([{source: 'scope', type: 'click', markname: 'voronoi'}]);
    expect(selCmpts['ten'].events).toEqual([{source: 'scope', type: 'mouseover', markname: 'voronoi'}]);
    expect(selCmpts['eleven'].events).toEqual([
      {source: 'scope', type: 'mouseover', markname: 'voronoi'},
      {source: 'scope', type: 'dblclick', markname: 'voronoi'}
    ]);
  });

  it('adds voronoi with tooltip for non-path marks', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];
    const nearestMarks = nearest.marks(model, selCmpts['one'] as SelectionComponent<'point'>, marks);
    expect(nearestMarks).toMatchObject(voronoiMark(null, null, tooltip(model, {reactiveGeom: true})));
  });

  it(
    'should warn for path marks',
    log.wrap(localLogger => {
      const model = getModel('line');
      const selCmpts = model.component.selection;
      const marks: any[] = [];
      expect(nearest.marks(model, selCmpts['one'] as SelectionComponent<'point'>, marks)).toEqual(marks);
      expect(localLogger.warns[0]).toEqual(log.message.nearestNotSupportForContinuous('line'));
    })
  );

  it('limits to a single voronoi per unit', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];

    const marks2 = nearest.marks(model, selCmpts['one'] as SelectionComponent<'point'>, marks);
    expect(nearest.marks(model, selCmpts['two'] as SelectionComponent<'point'>, marks2)).toMatchObject(voronoiMark());
  });

  it('supports 1D voronoi', () => {
    const model = getModel('circle');
    const selCmpts = model.component.selection;
    const marks: any[] = [{hello: 'world'}];

    expect(nearest.marks(model, selCmpts['seven'] as SelectionComponent<'point'>, duplicate(marks))).toMatchObject(
      voronoiMark(null, {expr: '0'})
    );

    expect(nearest.marks(model, selCmpts['eight'] as SelectionComponent<'point'>, duplicate(marks))).toMatchObject(
      voronoiMark({expr: '0'})
    );

    expect(nearest.marks(model, selCmpts['nine'] as SelectionComponent<'point'>, duplicate(marks))).toMatchObject(
      voronoiMark()
    );
  });
});

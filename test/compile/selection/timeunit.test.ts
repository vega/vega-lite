import {assembleRootData} from '../../../src/compile/data/assemble';
import {optimizeDataflow} from '../../../src/compile/data/optimize';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {Model} from '../../../src/compile/model';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import {Config} from '../../../src/config';
import {NormalizedUnitSpec} from '../../../src/spec';
import {parseModel, parseUnitModel} from '../../util';
import {deepEqual} from '../../../src/util';

function getData(model: Model) {
  optimizeDataflow(model.component.data, null);
  return assembleRootData(model.component.data, {});
}

function getConcatModel(unit2: NormalizedUnitSpec, config?: Config) {
  const model = parseModel({
    data: {
      values: [
        {date: 'Sun, 01 Jan 2012 23:00:01', price: 150},
        {date: 'Sun, 02 Jan 2012 00:10:02', price: 100},
        {date: 'Sun, 02 Jan 2012 01:20:03', price: 170},
        {date: 'Sun, 02 Jan 2012 02:30:04', price: 165},
        {date: 'Sun, 02 Jan 2012 03:40:05', price: 200}
      ]
    },
    hconcat: [
      {
        mark: 'point',
        params: [
          {
            name: 'two',
            select: {type: 'point', encodings: ['x', 'y']}
          }
        ],
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            timeUnit: 'seconds'
          },
          y: {field: 'price', type: 'quantitative'}
        }
      },
      unit2
    ],
    ...(config ? {config} : {})
  });
  model.parse();
  return model;
}

describe('Selection time unit', () => {
  it('dataflow nodes are constructed', () => {
    const model = parseUnitModel({
      mark: 'point',
      encoding: {
        x: {field: 'date', type: 'temporal', timeUnit: 'seconds'},
        y: {field: 'date', type: 'temporal', timeUnit: 'minutes'}
      }
    });
    const selCmpts = (model.component.selection = parseUnitSelection(model, [
      {name: 'one', select: 'point'},
      {name: 'two', select: {type: 'point', encodings: ['x', 'y']}}
    ]));

    expect(selCmpts['one'].project.timeUnit).not.toBeDefined();
    expect(selCmpts['two'].project.timeUnit).toBeInstanceOf(TimeUnitNode);

    const as = selCmpts['two'].project.timeUnit.assemble().map(tx => tx.as);
    expect(as).toEqual([
      ['seconds_date', 'seconds_date_end'],
      ['minutes_date', 'minutes_date_end']
    ]);
  });

  it('is added with conditional encodings', () => {
    const model = getConcatModel({
      mark: 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          timeUnit: 'minutes'
        },
        y: {field: 'price', type: 'quantitative'},
        color: {
          condition: {param: 'two', value: 'goldenrod'},
          value: 'steelblue'
        }
      }
    });
    const data1 = getData(model).filter(d => d.name === 'data_0')[0].transform;
    expect(
      data1.filter(tx => tx.type === 'timeunit' && deepEqual(tx.as, ['seconds_date', 'seconds_date_end']))
    ).toHaveLength(1);
  });

  it('is added before selection filters', () => {
    const model = getConcatModel(
      {
        transform: [{filter: {param: 'two'}}],
        mark: 'point',
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            timeUnit: 'minutes'
          },
          y: {field: 'price', type: 'quantitative'}
        }
      },
      {mark: {invalid: 'hide'}}
    );
    const data0 = getData(model).filter(d => d.name === 'data_0')[0].transform;
    const data1 = getData(model).filter(d => d.name === 'data_1')[0].transform;
    let tuIdx = -1;
    let selIdx = -1;
    data0.forEach((tx, idx) => {
      if (tx.type === 'timeunit' && deepEqual(tx.as, ['seconds_date', 'seconds_date_end'])) {
        tuIdx = idx;
      }
    });

    data1.forEach((tx, idx) => {
      if (tx.type === 'filter' && tx.expr.includes('vlSelectionTest')) {
        selIdx = idx;
      }
    });

    expect(tuIdx).not.toBe(-1);
    expect(selIdx).not.toBe(-1);
  });

  it('removes duplicate time unit formulae', () => {
    const model = getConcatModel({
      transform: [{filter: {param: 'two'}}],
      mark: 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          timeUnit: 'seconds'
        },
        y: {field: 'price', type: 'quantitative'}
      }
    });
    const data1 = getData(model).filter(d => d.name === 'data_0')[0].transform;
    expect(
      data1.filter(tx => tx.type === 'timeunit' && deepEqual(tx.as, ['seconds_date', 'seconds_date_end']))
    ).toHaveLength(1);
  });
});

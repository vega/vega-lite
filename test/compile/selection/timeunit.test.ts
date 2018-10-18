/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleRootData} from '../../../src/compile/data/assemble';
import {optimizeDataflow} from '../../../src/compile/data/optimize';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {Model} from '../../../src/compile/model';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import {NormalizedUnitSpec} from '../../../src/spec';
import {parseModel, parseUnitModel} from '../../util';

function getData(model: Model) {
  optimizeDataflow(model.component.data);
  return assembleRootData(model.component.data, {});
}

function getModel(unit2: NormalizedUnitSpec) {
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
        selection: {
          two: {type: 'single', encodings: ['x', 'y']}
        },
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
    ]
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
    const selCmpts = (model.component.selection = parseUnitSelection(model, {
      one: {type: 'single'},
      two: {type: 'single', encodings: ['x', 'y']}
    }));

    assert.isUndefined(selCmpts['one'].project.timeUnit);
    assert.instanceOf(selCmpts['two'].project.timeUnit, TimeUnitNode);

    const as = selCmpts['two'].project.timeUnit.assemble().map(tx => tx.as);
    assert.sameDeepMembers(as, ['seconds_date', 'minutes_date']);
  });

  it('is added with conditional encodings', () => {
    const model = getModel({
      mark: 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          timeUnit: 'minutes'
        },
        y: {field: 'price', type: 'quantitative'},
        color: {
          condition: {selection: 'two', value: 'goldenrod'},
          value: 'steelblue'
        }
      }
    });

    const data2 = getData(model).filter(d => d.name === 'data_2')[0].transform;
    assert.equal(data2.filter(tx => tx.type === 'formula' && tx.as === 'seconds_date').length, 1);
  });

  it('is added before selection filters', () => {
    const model = getModel({
      transform: [{filter: {selection: 'two'}}],
      mark: 'point',
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          timeUnit: 'minutes'
        },
        y: {field: 'price', type: 'quantitative'}
      }
    });
    const data0 = getData(model).filter(d => d.name === 'data_0')[0].transform;
    const data1 = getData(model).filter(d => d.name === 'data_1')[0].transform;
    let tuIdx = -1;
    let selIdx = -1;
    data0.forEach((tx, idx) => {
      if (tx.type === 'formula' && tx.as === 'seconds_date') {
        tuIdx = idx;
      }
    });

    data1.forEach((tx, idx) => {
      if (tx.type === 'filter' && tx.expr.indexOf('vlSelectionTest') >= 0) {
        selIdx = idx;
      }
    });

    assert.notEqual(tuIdx, -1);
    assert.notEqual(selIdx, -1);
  });

  it('removes duplicate time unit formulae', () => {
    const model = getModel({
      transform: [{filter: {selection: 'two'}}],
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

    const data2 = getData(model).filter(d => d.name === 'data_2')[0].transform;
    assert.equal(data2.filter(tx => tx.type === 'formula' && tx.as === 'seconds_date').length, 1);
  });
});

/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {assembleRootData} from '../../../src/compile/data/assemble';
import {OutputNode} from '../../../src/compile/data/dataflow';
import {SourceNode} from '../../../src/compile/data/source';
import {VgData} from '../../../src/vega.schema';

describe('compile/data/assemble', () => {
  describe('assembleData', () => {
    it('should assemble named data source', () => {
      const src = new SourceNode({name: 'foo'});
      const outputNodeRefCounts = {};
      const main = new OutputNode('mainOut', 'main', outputNodeRefCounts);
      main.parent = src;

      assert.equal(main.getSource(), 'mainOut');

      const data = assembleRootData({
        sources: {named: src},
        outputNodes: {out: main},
        outputNodeRefCounts,
        ancestorParse: {},
        isFaceted: false
      }, {});

      assert.equal(data.length, 1);
      assert.equal(data[0].name, "foo");
    });

    it('should assemble raw and main output', () => {
      const src = new SourceNode({url: 'foo.csv'});
      const outputNodeRefCounts = {};
      const raw = new OutputNode('rawOut', 'raw', outputNodeRefCounts);
      raw.parent = src;
      const agg = new AggregateNode({a: true}, {b: {count: 'count_*'}});
      agg.parent = raw;
      const main = new OutputNode('mainOut', 'main', outputNodeRefCounts);
      main.parent = agg;

      assert.equal(raw.getSource(), 'rawOut');
      assert.equal(main.getSource(), 'mainOut');

      const data = assembleRootData({
        sources: {named: src},
        outputNodes: {out: main},
        outputNodeRefCounts,
        ancestorParse: {},
        isFaceted: false
      }, {});

      assert.deepEqual<VgData[]>(data, [{
        name: 'source_0',
        url: 'foo.csv',
        format: {type: 'csv'}
      }, {
        name: 'data_0',
        source: 'source_0',
        transform: [{
          type: 'aggregate',
          groupby: ['a'],
          ops: ['count'],
          fields: ['b'],
          as: ['count_*']
        }]}
      ]);
    });
  });
});

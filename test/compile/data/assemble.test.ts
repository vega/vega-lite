/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {assembleRootData} from '../../../src/compile/data/assemble';
import {OutputNode} from '../../../src/compile/data/dataflow';
import {SourceNode} from '../../../src/compile/data/source';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';
import {VgData} from '../../../src/vega.schema';

describe('compile/data/assemble', () => {
  describe('assembleData', () => {
    it('should assemble named data source', () => {
      const src = new SourceNode({name: 'foo'});
      const outputNodeRefCounts = {};
      const main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
      main.parent = src;

      assert.equal(main.getSource(), 'mainOut');

      const data = assembleRootData(
        {
          sources: {named: src},
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      assert.equal(data.length, 1);
      assert.equal(data[0].name, 'foo');
    });

    it('should assemble raw and main output', () => {
      const src = new SourceNode({url: 'foo.csv'});
      const outputNodeRefCounts = {};
      const raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
      raw.parent = src;
      const agg = new AggregateNode(null, {a: true}, {b: {count: 'count_*'}});
      agg.parent = raw;
      const main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
      main.parent = agg;

      assert.equal(raw.getSource(), 'rawOut');
      assert.equal(main.getSource(), 'mainOut');

      const data = assembleRootData(
        {
          sources: {named: src},
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      assert.deepEqual<VgData[]>(data, [
        {
          name: 'source_0',
          url: 'foo.csv',
          format: {type: 'csv'}
        },
        {
          name: 'data_0',
          source: 'source_0',
          transform: [
            {
              type: 'aggregate',
              groupby: ['a'],
              ops: ['count'],
              fields: ['b'],
              as: ['count_*']
            }
          ]
        }
      ]);
    });

    it('should assemble window transform node', () => {
      const src = new SourceNode({url: 'foo.csv'});
      const outputNodeRefCounts = {};
      const raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
      raw.parent = src;
      const transform: Transform = {
        window: [
          {
            op: 'row_number',
            as: 'ordered_row_number'
          }
        ],
        ignorePeers: false,
        sort: [
          {
            field: 'f',
            order: 'ascending'
          }
        ],
        groupby: ['f'],
        frame: [null, 0]
      };
      const agg = new WindowTransformNode(null, transform);
      agg.parent = raw;
      const main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
      main.parent = agg;

      assert.equal(raw.getSource(), 'rawOut');
      assert.equal(main.getSource(), 'mainOut');

      const data = assembleRootData(
        {
          sources: {named: src},
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      assert.deepEqual<VgData[]>(data, [
        {
          name: 'source_0',
          url: 'foo.csv',
          format: {type: 'csv'}
        },
        {
          name: 'data_0',
          source: 'source_0',
          transform: [
            {
              type: 'window',
              ops: ['row_number'],
              fields: [null],
              params: [null],
              sort: {
                field: ['f'],
                order: ['ascending']
              },
              ignorePeers: false,
              as: ['ordered_row_number'],
              frame: [null, 0],
              groupby: ['f']
            }
          ]
        }
      ]);
    });

    it('should assemble named datasets with datastore', () => {
      const src = new SourceNode({name: 'foo'});
      const outputNodeRefCounts = {};
      const main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
      main.parent = src;

      const data = assembleRootData(
        {
          sources: {named: src},
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {
          foo: [1, 2, 3]
        }
      );

      assert.deepEqual<VgData[]>(data, [
        {
          name: 'foo',
          values: [1, 2, 3]
        }
      ]);
    });
  });
});

import {AggregateNode} from '../../../src/compile/data/aggregate';
import {assembleRootData} from '../../../src/compile/data/assemble';
import {OutputNode} from '../../../src/compile/data/dataflow';
import {SourceNode} from '../../../src/compile/data/source';
import {WindowTransformNode} from '../../../src/compile/data/window';
import {Transform} from '../../../src/transform';
import {DataSourceType} from '../../../src/data';

describe('compile/data/assemble', () => {
  describe('assembleData', () => {
    it('should assemble named data source', () => {
      const src = new SourceNode({name: 'foo'});
      const outputNodeRefCounts = {};
      const main = new OutputNode(null, 'mainOut', DataSourceType.Main, outputNodeRefCounts);
      main.parent = src;

      expect(main.getSource()).toBe('mainOut');

      const data = assembleRootData(
        {
          sources: [src],
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('foo');
    });

    it('should assemble raw and main output', () => {
      const src = new SourceNode({url: 'foo.csv'});
      const outputNodeRefCounts = {};
      const raw = new OutputNode(null, 'rawOut', DataSourceType.Raw, outputNodeRefCounts);
      raw.parent = src;
      const agg = new AggregateNode(null, new Set(['a']), {b: {count: new Set(['count_*'])}});
      agg.parent = raw;
      const main = new OutputNode(null, 'mainOut', DataSourceType.Main, outputNodeRefCounts);
      main.parent = agg;

      expect(raw.getSource()).toBe('rawOut');
      expect(main.getSource()).toBe('mainOut');

      const data = assembleRootData(
        {
          sources: [src],
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      expect(data).toEqual([
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
      const raw = new OutputNode(null, 'rawOut', DataSourceType.Raw, outputNodeRefCounts);
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
      const main = new OutputNode(null, 'mainOut', DataSourceType.Main, outputNodeRefCounts);
      main.parent = agg;

      expect(raw.getSource()).toBe('rawOut');
      expect(main.getSource()).toBe('mainOut');

      const data = assembleRootData(
        {
          sources: [src],
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {}
      );

      expect(data).toEqual([
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
      const main = new OutputNode(null, 'mainOut', DataSourceType.Main, outputNodeRefCounts);
      main.parent = src;

      const data = assembleRootData(
        {
          sources: [src],
          outputNodes: {out: main},
          outputNodeRefCounts,
          isFaceted: false
        },
        {
          foo: [1, 2, 3]
        }
      );

      expect(data).toEqual([
        {
          name: 'foo',
          values: [1, 2, 3]
        }
      ]);
    });
  });
});

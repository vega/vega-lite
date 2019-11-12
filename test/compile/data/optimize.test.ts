import {OutputNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {optimizeDataflow} from '../../../src/compile/data/optimize';
import {SourceNode} from '../../../src/compile/data/source';
import {parseLayerModel} from '../../util';

describe('compile/data/optimize', () => {
  describe('optimizeDataFlow', () => {
    it('should move up common parse', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'time', b: 'number'});
      const parseTwo = new ParseNode(source, {a: 'time', b: 'date'});
      new OutputNode(parseOne, 'foo', null, {foo: 1});
      new OutputNode(parseTwo, 'bar', null, {bar: 1});

      optimizeDataflow({sources: [source]} as any, null);

      expect(source.children).toHaveLength(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({a: 'time'});
      expect(commonParse.children).toHaveLength(2);

      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[0]).toEqual(parseOne);

      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toEqual(parseTwo);
    });

    it('should push parse up from lowest level first to avoid conflicting common parse', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'time'});
      const parseTwo = new ParseNode(source, {b: 'number'});
      const parseThree = new ParseNode(parseTwo, {a: 'number'});
      new OutputNode(parseOne, 'foo', null, {foo: 1});
      new OutputNode(parseThree, 'bar', null, {bar: 1});

      optimizeDataflow({sources: [source]} as any, null);

      expect(source.children).toHaveLength(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({b: 'number'});

      expect(commonParse.children).toHaveLength(2);
      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);

      const p1 = commonParse.children[0] as ParseNode;
      const p2 = commonParse.children[1] as ParseNode;

      expect(p1.parse).toEqual({a: 'time'});
      expect(p2.parse).toEqual({a: 'number'});
    });

    it('should rename signals when merging BinNodes', () => {
      const transform = {
        bin: {extent: [0, 100] as [number, number], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = parseLayerModel({
        layer: [
          {
            transform: [transform],
            mark: 'rect',
            encoding: {}
          },
          {
            transform: [transform],
            mark: 'rect',
            encoding: {}
          }
        ]
      });
      model.parse();
      optimizeDataflow(model.component.data, model);
      expect(model.getSignalName('layer_0_bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins')).toEqual(
        'layer_1_bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
      );
    });
  });
});

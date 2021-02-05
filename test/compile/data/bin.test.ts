import {BinTransform as VgBinTransform} from 'vega';
import {BIN_RANGE_DELIMITER} from '../../../src/compile/common';
import {BinNode, getBinSignalName} from '../../../src/compile/data/bin';
import {Model, ModelWithField} from '../../../src/compile/model';
import {BinTransform} from '../../../src/transform';
import {parseUnitModelWithScale, parseUnitModelWithScaleAndSelection} from '../../util';
import {PlaceholderDataFlowNode} from './util';

function assembleFromEncoding(model: ModelWithField) {
  return BinNode.makeFromEncoding(null, model).assemble();
}

function assembleFromTransform(model: Model, t: BinTransform) {
  return BinNode.makeFromTransform(null, t, model).assemble();
}

function makeMovieExample(t: BinTransform) {
  return parseUnitModelWithScale({
    data: {url: 'data/movies.json'},
    mark: 'circle',
    transform: [t],
    encoding: {
      x: {
        field: 'Rotten_Tomatoes_Rating',
        type: 'quantitative'
      },
      color: {
        field: 'Rotten_Tomatoes_Rating',
        type: 'quantitative'
      }
    }
  });
}

function makeMovieExampleWithSelection(t: BinTransform) {
  return parseUnitModelWithScaleAndSelection({
    data: {url: 'data/movies.json'},
    params: [{name: 'foo', select: {type: 'interval'}}],
    mark: 'circle',
    transform: [t],
    encoding: {
      x: {
        field: 'Rotten_Tomatoes_Rating',
        type: 'quantitative'
      },
      y: {
        field: 'Rotten_Tomatoes_Rating',
        type: 'quantitative'
      },
      color: {
        field: 'Rotten_Tomatoes_Rating',
        type: 'quantitative'
      }
    }
  });
}

describe('compile/data/bin', () => {
  describe('assembleFromEncoding', () => {
    it('should add bin transform and correctly apply bin with custom extent', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {
            bin: {extent: [0, 100]},
            field: 'Acceleration',
            type: 'quantitative'
          }
        }
      });

      expect(assembleFromEncoding(model)[0]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: ['bin_extent_0_100_maxbins_10_Acceleration', 'bin_extent_0_100_maxbins_10_Acceleration_end'],
        maxbins: 10,
        extent: [0, 100],
        signal: 'bin_extent_0_100_maxbins_10_Acceleration_bins'
      });
    });

    it('should add bin transform and correctly apply bin for binned field without custom extent', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {
            bin: true,
            field: 'Acceleration',
            type: 'quantitative'
          }
        }
      });
      const transform = assembleFromEncoding(model);
      expect(transform).toHaveLength(2);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Acceleration',
        signal: 'bin_maxbins_10_Acceleration_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: ['bin_maxbins_10_Acceleration', 'bin_maxbins_10_Acceleration_end'],
        maxbins: 10,
        signal: 'bin_maxbins_10_Acceleration_bins',
        extent: {signal: 'bin_maxbins_10_Acceleration_extent'}
      });
    });

    it('should add bin transform and correctly apply bin for binned field with selection extent', () => {
      const model = parseUnitModelWithScaleAndSelection({
        params: [{name: 'foo', select: {type: 'interval', fields: ['Acceleration']}}],
        mark: 'point',
        encoding: {
          x: {
            bin: {extent: {param: 'foo'}},
            field: 'Acceleration',
            type: 'quantitative'
          },
          y: {
            bin: {extent: {param: 'foo'}},
            field: 'mpg',
            type: 'quantitative'
          }
        }
      });
      const transform = assembleFromEncoding(model);
      expect(transform).toHaveLength(4);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Acceleration',
        signal: 'bin_extent_param_foo_maxbins_10_Acceleration_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: ['bin_extent_param_foo_maxbins_10_Acceleration', 'bin_extent_param_foo_maxbins_10_Acceleration_end'],
        maxbins: 10,
        signal: 'bin_extent_param_foo_maxbins_10_Acceleration_bins',
        extent: {signal: 'bin_extent_param_foo_maxbins_10_Acceleration_extent'},
        span: {signal: 'span(foo["Acceleration"])'}
      });
    });

    it('should add bin transform and correctly apply bin for binned field with selection with field extent', () => {
      const model = parseUnitModelWithScaleAndSelection({
        params: [{name: 'foo', select: {type: 'interval', fields: ['Acceleration']}}],
        mark: 'point',
        encoding: {
          y: {
            bin: {extent: {param: 'foo', field: 'bar'}},
            field: 'Acceleration',
            type: 'quantitative'
          },
          x: {
            bin: {extent: {param: 'foo', field: 'bar'}},
            field: 'Acceleration',
            type: 'quantitative'
          }
        }
      });
      const transform = assembleFromEncoding(model);
      expect(transform).toHaveLength(2);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Acceleration',
        signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: [
          'bin_extent_param_foo_field_bar_maxbins_10_Acceleration',
          'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_end'
        ],
        maxbins: 10,
        signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_bins',
        extent: {signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_extent'},
        span: {signal: 'span(foo["bar"])'}
      });
    });

    it('should apply the bin transform only once for a binned field encoded in multiple channels', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'circle',
        encoding: {
          x: {
            bin: true,
            field: 'Rotten_Tomatoes_Rating',
            type: 'quantitative'
          },
          color: {
            bin: {maxbins: 10},
            field: 'Rotten_Tomatoes_Rating',
            type: 'ordinal'
          }
        }
      });
      const transform = assembleFromEncoding(model);
      expect(transform).toHaveLength(3);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Rotten_Tomatoes_Rating',
        signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Rotten_Tomatoes_Rating',
        as: ['bin_maxbins_10_Rotten_Tomatoes_Rating', 'bin_maxbins_10_Rotten_Tomatoes_Rating_end'],
        signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
        maxbins: 10,
        extent: {signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'}
      });
      expect(transform[2]).toEqual({
        type: 'formula',
        as: 'bin_maxbins_10_Rotten_Tomatoes_Rating_range',
        expr: `!isValid(datum["bin_maxbins_10_Rotten_Tomatoes_Rating"]) || !isFinite(+datum["bin_maxbins_10_Rotten_Tomatoes_Rating"]) ? "null" : format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating"], "") + "${BIN_RANGE_DELIMITER}" + format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_end"], "")`
      });
    });
  });

  describe('assembleFromTransform', () => {
    it('should add bin transform from transform array and correctly apply bin with custom extent', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100]},
        field: 'Acceleration',
        as: 'binned_acceleration'
      };
      const model = makeMovieExample(t);

      expect(assembleFromTransform(model, t)[0]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        maxbins: 10,
        as: ['binned_acceleration', 'binned_acceleration_end'],
        extent: [0, 100],
        signal: 'bin_extent_0_100_maxbins_10_Acceleration_bins'
      });
    });

    it('should add bin transform from transform array and correctly apply maxbins with custom extent', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], maxbins: 20},
        field: 'Acceleration',
        as: 'binned_acceleration'
      };
      const model = makeMovieExample(t);

      expect(assembleFromTransform(model, t)[0]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        maxbins: 20,
        as: ['binned_acceleration', 'binned_acceleration_end'],
        extent: [0, 100],
        signal: 'bin_extent_0_100_maxbins_20_Acceleration_bins'
      });
    });

    it('should add bin transform from transform array and correctly apply bin with selection extent', () => {
      const t: BinTransform = {
        bin: {extent: {param: 'foo'}},
        field: 'Acceleration',
        as: 'binned_acceleration'
      };
      const model = makeMovieExampleWithSelection(t);

      const transform = assembleFromTransform(model, t);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Acceleration',
        signal: 'bin_extent_param_foo_maxbins_10_Acceleration_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: ['binned_acceleration', 'binned_acceleration_end'],
        maxbins: 10,
        signal: 'bin_extent_param_foo_maxbins_10_Acceleration_bins',
        extent: {signal: 'bin_extent_param_foo_maxbins_10_Acceleration_extent'},
        span: {signal: 'span(foo["Rotten_Tomatoes_Rating"])'}
      });
    });

    it('should add bin transform from transform array and correctly apply bin with selection with field extent', () => {
      const t: BinTransform = {
        bin: {extent: {param: 'foo', field: 'bar'}},
        field: 'Acceleration',
        as: 'binned_acceleration'
      };
      const model = makeMovieExampleWithSelection(t);

      const transform = assembleFromTransform(model, t);
      expect(transform[0]).toEqual({
        type: 'extent',
        field: 'Acceleration',
        signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_extent'
      });
      expect(transform[1]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        as: ['binned_acceleration', 'binned_acceleration_end'],
        maxbins: 10,
        signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_bins',
        extent: {signal: 'bin_extent_param_foo_field_bar_maxbins_10_Acceleration_extent'},
        span: {signal: 'span(foo["bar"])'}
      });
    });

    it('should add bin transform from transform array with anchor property', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: 'binned_acceleration'
      };
      const model = makeMovieExample(t);

      expect(assembleFromTransform(model, t)[0]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        anchor: 6,
        maxbins: 10,
        as: ['binned_acceleration', 'binned_acceleration_end'],
        extent: [0, 100],
        signal: 'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
      });
    });

    it('should add bin transform from transform array with array as', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = makeMovieExample(t);

      expect(assembleFromTransform(model, t)[0]).toEqual({
        type: 'bin',
        field: 'Acceleration',
        anchor: 6,
        maxbins: 10,
        as: ['binned_acceleration_start', 'binned_acceleration_stop'],
        extent: [0, 100],
        signal: 'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
      });
    });
  });

  describe('BinNode', () => {
    it('should generate the correct hash', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = makeMovieExample(t);

      const binNode = BinNode.makeFromTransform(null, t, model);
      expect(binNode.hash()).toBe('Bin 1499261512');
    });

    it('should generate the correct dependent fields', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = makeMovieExample(t);

      const binNode = BinNode.makeFromTransform(null, t, model);
      expect(binNode.dependentFields()).toEqual(new Set(['Acceleration']));
    });

    it('should generate the correct produced fields', () => {
      const t: BinTransform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = makeMovieExample(t);

      const binNode = BinNode.makeFromTransform(null, t, model);
      expect(binNode.hash()).toBe('Bin 1499261512');
      expect(binNode.producedFields()).toEqual(new Set(['binned_acceleration_start', 'binned_acceleration_stop']));
    });

    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const bin = new BinNode(parent, {});
      expect(bin.clone().parent).toBeNull();
    });

    it('should preserve "as" when merging with other node', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const binNodeA = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['foo', 'foo_end']]}});
      const binNodeB = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['bar', 'bar_end']]}});

      binNodeA.merge(binNodeB, () => {
        /* do nothing */
      });
      expect(binNodeA).toEqual(
        new BinNode(parent, {
          foo: {
            bin: {},
            field: 'foo',
            as: [
              ['foo', 'foo_end'],
              ['bar', 'bar_end']
            ]
          }
        })
      );
    });

    it('should not have duplicate members of "as" after merging with other node', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const binNodeA = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['foo', 'foo_end']]}});
      const binNodeB = new BinNode(parent, {
        foo: {
          bin: {},
          field: 'foo',
          as: [
            ['foo', 'foo_end'],
            ['bar', 'bar_end']
          ]
        }
      });

      binNodeA.merge(binNodeB, () => {
        /* do nothing */
      });
      expect(binNodeA).toEqual(
        new BinNode(parent, {
          foo: {
            bin: {},
            field: 'foo',
            as: [
              ['foo', 'foo_end'],
              ['bar', 'bar_end']
            ]
          }
        })
      );
    });

    it('should create formulas for members of "as" when assembled', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const binNode = new BinNode(parent, {
        foo: {
          bin: {},
          field: 'foo',
          as: [
            ['foo', 'foo_end'],
            ['bar', 'bar_end']
          ]
        }
      });
      const transforms = binNode.assemble();

      expect(transforms[1]).toEqual({type: 'formula', expr: 'datum["foo"]', as: 'bar'});
      expect(transforms[2]).toEqual({type: 'formula', expr: 'datum["foo_end"]', as: 'bar_end'});
    });

    it('should resassign children of BinNode when merging', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const binNodeA = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['foo', 'foo_end']]}});
      const binNodeB = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['bar', 'bar_end']]}});
      const childA = new PlaceholderDataFlowNode(binNodeA);
      const childB = new PlaceholderDataFlowNode(binNodeB);

      binNodeA.merge(binNodeB, () => {
        /* do nothing */
      });

      expect(binNodeB.children).toHaveLength(0);
      expect(binNodeA.children).toHaveLength(2);
      expect(binNodeA.children).toContain(childA);
      expect(binNodeA.children).toContain(childB);
    });

    it('should keep non-conflicting bins of BinNodes when merging', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const binNodeA = new BinNode(parent, {foo: {bin: {}, field: 'foo', as: [['foo', 'foo_end']]}});
      const binNodeB = new BinNode(parent, {bar: {bin: {}, field: 'bar', as: [['bar', 'bar_end']]}});

      binNodeA.merge(binNodeB, () => {
        /* do nothing */
      });
      expect(binNodeA).toEqual(
        new BinNode(parent, {
          foo: {bin: {}, field: 'foo', as: [['foo', 'foo_end']]},
          bar: {bin: {}, field: 'bar', as: [['bar', 'bar_end']]}
        })
      );
    });
  });

  describe('getBinSignalName', () => {
    it('should genrate correct names', () => {
      const model = parseUnitModelWithScale({
        mark: 'point'
      });

      expect(getBinSignalName(model, 'foo.bar', true)).toBe('bin_maxbins_10_foo_bar_bins');
      expect(getBinSignalName(model, 'foo', true)).toBe('bin_maxbins_10_foo_bins');
      expect(getBinSignalName(model, 'foo', {maxbins: 20})).toBe('bin_maxbins_20_foo_bins');
    });

    it('should generate the same name as signal name from encoding', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          y: {
            bin: true,
            field: 'foo.bar',
            type: 'quantitative'
          }
        }
      });

      const signal = getBinSignalName(model, 'foo.bar', true);
      expect(signal).toBe('bin_maxbins_10_foo_bar_bins');

      const bin = assembleFromEncoding(model)[1] as VgBinTransform;

      expect(bin.signal).toBe(signal);
    });
  });
});

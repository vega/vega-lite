/* tslint:disable:quotemark */

import {BinNode} from '../../../src/compile/data/bin';
import {Model, ModelWithField} from '../../../src/compile/model';
import {BinTransform} from '../../../src/transform';
import {parseUnitModelWithScale} from '../../util';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

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

describe('compile/data/bin', () => {
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
      expr: `datum["bin_maxbins_10_Rotten_Tomatoes_Rating"] === null || isNaN(datum["bin_maxbins_10_Rotten_Tomatoes_Rating"]) ? "null" : format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating"], "") + " - " + format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_end"], "")`
    });
  });

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
      signal: 'bin_extent_0_100_maxbins_10_Acceleration_binned_acceleration_binned_acceleration_end_bins'
    });
  });

  it('should add bin transform from transform array and correctly apply bin with custom extent', () => {
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
      signal: 'bin_extent_0_100_maxbins_20_Acceleration_binned_acceleration_binned_acceleration_end_bins'
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
      signal: 'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_binned_acceleration_binned_acceleration_end_bins'
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
      signal:
        'bin_extent_0_100_anchor_6_maxbins_10_Acceleration_binned_acceleration_start_binned_acceleration_stop_bins'
    });
  });

  it('should generate the correct hash', () => {
    const t: BinTransform = {
      bin: {extent: [0, 100], anchor: 6},
      field: 'Acceleration',
      as: ['binned_acceleration_start', 'binned_acceleration_stop']
    };
    const model = makeMovieExample(t);

    const binNode = BinNode.makeFromTransform(null, t, model);
    expect(binNode.hash()).toBe('Bin 1572838704');
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
    expect(binNode.hash()).toBe('Bin 1572838704');
    expect(binNode.producedFields()).toEqual(new Set(['binned_acceleration_start', 'binned_acceleration_stop']));
  });

  it('should never clone parent', () => {
    const parent = new DataFlowNode(null);
    const bin = new BinNode(parent, {});
    expect(bin.clone().parent).toBeNull();
  });
});

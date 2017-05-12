/* tslint:disable:quotemark */

import {assert} from 'chai';

import {BinNode} from '../../../src/compile/data/bin';
import {ModelWithField} from '../../../src/compile/model';
import {BinTransform} from '../../../src/transform';
import {VgTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

function assemble(model: ModelWithField) {
  return BinNode.make(model).assemble();
}

describe.only('compile/data/bin', function() {
  it('should add bin transform and correctly apply bin with custom extent', function() {
    const model = parseUnitModel({
      mark: 'point',
      encoding: {
        y: {
          bin: {extent: [0, 100]},
          'field': 'Acceleration',
          'type': 'quantitative'
        }
      }
    });

    assert.deepEqual<VgTransform>(assemble(model)[0], {
      type: 'bin',
      field: 'Acceleration',
      as: ['bin_extent_0,100_maxbins_10_Acceleration_start', 'bin_extent_0,100_maxbins_10_Acceleration_end'],
      maxbins: 10,
      extent: [0, 100],
      signal: "bin_extent_0_100_maxbins_10_Acceleration_bins",
    });
  });

  it ('should add bin transform and correctly apply bin for binned field without custom extent', () => {
    const model = parseUnitModel({
      mark: 'point',
      encoding: {
        y: {
          bin: true,
          'field': 'Acceleration',
          'type': 'quantitative'
        }
      }
    });
    const transform = assemble(model);
    assert.deepEqual(transform.length, 2);
    assert.deepEqual<VgTransform>(transform[0], {
      type: 'extent',
      field: 'Acceleration',
      signal: 'bin_maxbins_10_Acceleration_extent'
    });
    assert.deepEqual<VgTransform>(transform[1], {
      type: 'bin',
      field: 'Acceleration',
      as: ['bin_maxbins_10_Acceleration_start', 'bin_maxbins_10_Acceleration_end'],
      maxbins: 10,
      signal: 'bin_maxbins_10_Acceleration_bins',
      extent: {signal: 'bin_maxbins_10_Acceleration_extent'}
    });
  });

  it('should apply the bin transform only once for a binned field encoded in multiple channels', () => {
    const model = parseUnitModel({
      data: {url: "data/movies.json"},
      mark: "circle",
      encoding: {
        x: {
          bin: true,
          field: "Rotten_Tomatoes_Rating",
          type: "q"
        },
        color: {
          bin: {"maxbins": 10},
          field: "Rotten_Tomatoes_Rating",
          type: "q"
        }
      }
    });
    const transform = assemble(model);
    assert.deepEqual(transform.length, 3);
    assert.deepEqual<VgTransform>(transform[0], {
      type: 'extent',
      field: 'Rotten_Tomatoes_Rating',
      signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
    });
    assert.deepEqual<VgTransform>(transform[1], {
      type: 'bin',
      field: 'Rotten_Tomatoes_Rating',
      as:
      [ 'bin_maxbins_10_Rotten_Tomatoes_Rating_start',
        'bin_maxbins_10_Rotten_Tomatoes_Rating_end' ],
      signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
      maxbins: 10,
      extent: {signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'}
    });
    assert.deepEqual<VgTransform>(transform[2], {
      type: 'formula',
      as: 'bin_maxbins_10_Rotten_Tomatoes_Rating_range',
      expr: 'format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_start"], \'s\') + \' - \' + format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_end"], \'s\')'
    });
  });

  it ('should add bin transform and correctly apply bin for binned field without custom extent', () => {
    const model = parseUnitModel({
      mark: 'point',
      encoding: {
        y: {
          bin: true,
          'field': 'Acceleration',
          'type': 'quantitative'
        }
      }
    });
    const transform = assemble(model);
    assert.deepEqual(transform.length, 2);
    assert.deepEqual<VgTransform>(transform[0], {
      type: 'extent',
      field: 'Acceleration',
      signal: 'bin_maxbins_10_Acceleration_extent'
    });
    assert.deepEqual<VgTransform>(transform[1], {
      type: 'bin',
      field: 'Acceleration',
      as: ['bin_maxbins_10_Acceleration_start', 'bin_maxbins_10_Acceleration_end'],
      maxbins: 10,
      signal: 'bin_maxbins_10_Acceleration_bins',
      extent: {signal: 'bin_maxbins_10_Acceleration_extent'}
    });
  });

  it('should apply the bin transform if specified BinTransform', () => {
    const t: BinTransform = {bin: {"maxbins" : 10}, field: "Rotten_Tomatoes_Rating", as: "something"};
    const model = parseUnitModel({
      data: {url: "data/movies.json"},
      mark: "circle",
      transform: [t],
      encoding: {
        x: {
          bin: true,
          field: "Rotten_Tomatoes_Rating",
          type: "q"
        },
        color: {
          bin: {"maxbins": 10},
          field: "Rotten_Tomatoes_Rating",
          type: "q"
        }
      }
    });
    const transform = BinNode.makeTransform(model, t).assemble();
    assert.deepEqual<VgTransform>(transform[1], {
      type: 'bin',
      field: 'Rotten_Tomatoes_Rating',
      as:
      [ 'bin_maxbins_10_Rotten_Tomatoes_Rating_start',
        'bin_maxbins_10_Rotten_Tomatoes_Rating_end' ],
      signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
      maxbins: 10,
      extent: {signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'}
    });
  });
});

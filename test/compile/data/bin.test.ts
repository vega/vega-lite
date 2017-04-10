/* tslint:disable:quotemark */

import {assert} from 'chai';

import {bin} from '../../../src/compile/data/bin';
import {vals} from '../../../src/util';

import {parseUnitModel} from '../../util';

describe('compile/data/bin', function() {
  describe('parseUnit', function() {
    describe('binned field with custom extent', () => {
      it('should add bin transform and correctly apply bin', function() {
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
        const transform = vals(bin.parseUnit(model))[0];
        assert.deepEqual(transform[0], {
          type: 'bin',
          field: 'Acceleration',
          as: ['bin_extent_0,100_maxbins_10_Acceleration_start', 'bin_extent_0,100_maxbins_10_Acceleration_end'],
          maxbins: 10,
          extent: [0, 100],
          signal: 'bin_extent_0_100_maxbins_10_Acceleration_bins',
        });
      });
    });

    describe('binned field without custom extent', () => {
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
      const transform = vals(bin.parseUnit(model))[0];

      it('should add bin transform and correctly apply bin', function() {
        assert.deepEqual(transform.length, 2);
        assert.deepEqual(transform[0], {
          type: 'extent',
          field: 'Acceleration',
          signal: 'bin_maxbins_10_Acceleration_extent'
        });
        assert.deepEqual(transform[1], {
          type: 'bin',
          field: 'Acceleration',
          as: ['bin_maxbins_10_Acceleration_start', 'bin_maxbins_10_Acceleration_end'],
          maxbins: 10,
          signal: 'bin_maxbins_10_Acceleration_bins',
          extent: {signal: 'bin_maxbins_10_Acceleration_extent'}
        });
      });
    });
    describe('same field encoded twice', () => {
      const model = parseUnitModel({
        data: {'url': 'data/movies.json'},
        mark: 'circle',
        encoding: {
          x: {
            bin: {maxbins: 10},
            field: 'IMDB_Rating',
            type: 'q'
          },
          y: {
            bin: {'maxbins': 10},
            field: 'Rotten_Tomatoes_Rating',
            type: 'q'
          },
          color: {
            bin: {maxbins: 20},
            field: 'Rotten_Tomatoes_Rating',
            type: 'quantitative'
          },
          size: {
            aggregate: 'count',
            field: '*',
            type: 'q'
          }
        }
      });
      const transformArray = bin.parseUnit(model);
      const transformArrayVals = vals(transformArray);
      const imdbTransform = transformArrayVals[0];
      const rotten10Transform = transformArrayVals[1];
      const rotten20Transform = transformArrayVals[2];
      it('should be binned twice', function() {
        assert.deepEqual(imdbTransform.length, 2);
        assert.deepEqual(imdbTransform[0], {
          type: 'extent',
          field: 'IMDB_Rating',
          signal: 'bin_maxbins_10_IMDB_Rating_extent'
        });
        assert.deepEqual(imdbTransform[1],{
          type: 'bin',
          field: 'IMDB_Rating',
          as: [ 'bin_maxbins_10_IMDB_Rating_start', 'bin_maxbins_10_IMDB_Rating_end' ],
          signal: 'bin_maxbins_10_IMDB_Rating_bins',
          maxbins: 10,
          extent: {signal: 'bin_maxbins_10_IMDB_Rating_extent'}
        });

        assert.deepEqual(imdbTransform.length, 2);
        assert.deepEqual(rotten10Transform[0], {
          type: 'extent',
          field: 'Rotten_Tomatoes_Rating',
          signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
        });
        assert.deepEqual(rotten10Transform[1], {
          type: 'bin',
          field: 'Rotten_Tomatoes_Rating',
          as:
          [ 'bin_maxbins_10_Rotten_Tomatoes_Rating_start',
            'bin_maxbins_10_Rotten_Tomatoes_Rating_end' ],
          signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
          maxbins: 10,
          extent: {signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'}
        });

        assert.deepEqual(rotten20Transform.length, 3);
        assert.deepEqual(rotten20Transform[0], {
          type: 'extent',
          field: 'Rotten_Tomatoes_Rating',
          signal: 'bin_maxbins_20_Rotten_Tomatoes_Rating_extent'
        });
        assert.deepEqual(rotten20Transform[1], {
          type: 'bin',
          field: 'Rotten_Tomatoes_Rating',
          as:
          [ 'bin_maxbins_20_Rotten_Tomatoes_Rating_start',
            'bin_maxbins_20_Rotten_Tomatoes_Rating_end' ],
          signal: 'bin_maxbins_20_Rotten_Tomatoes_Rating_bins',
          maxbins: 20,
          extent: {signal: 'bin_maxbins_20_Rotten_Tomatoes_Rating_extent'}
        });
        assert.deepEqual(rotten20Transform[2], {
          type: 'formula',
          as: 'bin_maxbins_20_Rotten_Tomatoes_Rating_range',
          expr: 'format(datum["bin_maxbins_20_Rotten_Tomatoes_Rating_start"], \'s\') + \' - \' + format(datum["bin_maxbins_20_Rotten_Tomatoes_Rating_end"], \'s\')'
        });
      });
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    // TODO: write test
  });

  describe('assemble', function() {
    // TODO: write test
  });
});

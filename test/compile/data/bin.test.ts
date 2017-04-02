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
          mark: "point",
          encoding: {
            y: {
              bin: {extent: [0, 100]},
              'field': 'Acceleration',
              'type': "quantitative"
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
          signal: "bin_extent_0,100_maxbins_10_Acceleration_bins",
        });
      });
    });

    describe('binned field without custom extent', () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          y: {
            bin: true,
            'field': 'Acceleration',
            'type': "quantitative"
          }
        }
      });
      const transform = vals(bin.parseUnit(model))[0];

      it('should add bin transform and correctly apply bin', function() {
        assert.deepEqual(transform[0], {
          type: 'extent',
          field: 'Acceleration',
          signal: 'bin_Acceleration_extent'
        });
        assert.deepEqual(transform[1], {
          type: 'bin',
          field: 'Acceleration',
          as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
          maxbins: 10,
          signal: "bin_Acceleration_bins",
          extent: {signal: 'bin_Acceleration_extent'}
        });
      });
    });
    describe('should bin the same field', () => {
      const model = parseUnitModel({
        data: {"url": "data/movies.json"},
        mark: "circle",
        encoding: {
          x: {
            bin: {maxbins: 10},
            field: "IMDB_Rating",
            type: "q"
          },
          y: {
            bin: {"maxbins": 10},
            field: "Rotten_Tomatoes_Rating",
            type: "q"
          },
          color: {
            bin: {maxbins: 20},
            field: "Rotten_Tomatoes_Rating",
            type: "quantitative"
          },
          size: {
            aggregate: "count",
            field: "*",
            type: "q"
          }
        }
      });
      const transform = vals(bin.parseUnit(model))[0];
      assert.deepEqual(transform[0], {
        type: 'extent',
        field: 'IMDB_Rating',
        signal: 'bin_maxbins_10_IMDB_Rating_extent'
      });
      assert.deepEqual(transform[1],{
        type: 'bin',
        field: 'IMDB_Rating',
        as: [ 'bin_maxbins_10_IMDB_Rating_start', 'bin_maxbins_10_IMDB_Rating_end' ],
        signal: 'bin_maxbins_10_IMDB_Rating_bins',
        maxbins: 10,
        extent: {signal: 'bin_maxbins_10_IMDB_Rating_extent'}
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

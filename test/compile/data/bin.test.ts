/* tslint:disable:quotemark */

import {assert} from 'chai';

import {bin} from '../../../src/compile/data/bin';
import {vals} from '../../../src/util';

import {parseUnitModel} from '../../util';

describe('compile/data/bin', function() {
  describe('parseUnit', function() {
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
      const transform = vals(bin.parseUnit(model))[0];
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
      const transformArray = vals(bin.parseUnit(model));
      assert.deepEqual(transformArray.length, 1); // Generate only one
      const transform = transformArray[0];
      assert.deepEqual(transform[0], {
        type: 'extent',
        field: 'Rotten_Tomatoes_Rating',
        signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'
      });
      assert.deepEqual(transform[1], {
        type: 'bin',
        field: 'Rotten_Tomatoes_Rating',
        as:
        [ 'bin_maxbins_10_Rotten_Tomatoes_Rating_start',
          'bin_maxbins_10_Rotten_Tomatoes_Rating_end' ],
        signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_bins',
        maxbins: 10,
        extent: {signal: 'bin_maxbins_10_Rotten_Tomatoes_Rating_extent'}
      });
      assert.deepEqual(transform[2], {
        type: 'formula',
        as: 'bin_maxbins_10_Rotten_Tomatoes_Rating_range',
        expr: 'format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_start"], \'s\') + \' - \' + format(datum["bin_maxbins_10_Rotten_Tomatoes_Rating_end"], \'s\')'
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

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

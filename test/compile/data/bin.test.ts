/* tslint:disable:quotemark */

import {assert} from 'chai';

import {bin} from '../../../src/compile/data/bin';
import {vals} from '../../../src/util';

import {parseUnitModel} from '../../util';

describe('compile/data/bin', function() {
  describe('parseUnit', function() {
    it('should add bin transform and correctly apply bin', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          y: {
            bin: { min: 0, max: 100 },
            'field': 'Acceleration',
            'type': "quantitative"
          }
        }
      });
      const transform = vals(bin.parseUnit(model))[0];

      assert.deepEqual(transform[0], {
        type: 'bin',
        field: 'Acceleration',
        output: {
          start: 'bin_Acceleration_start',
          mid: 'bin_Acceleration_mid',
          end: 'bin_Acceleration_end'
        },
        maxbins: 10,
        min: 0,
        max: 100
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

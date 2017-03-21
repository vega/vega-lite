/* tslint:disable:quotemark */

import {assert} from 'chai';
import {timeUnit} from '../../../src/compile/data/timeunit';
import {parseUnitModel} from '../../util';

describe('compile/data/timeunit', () => {
  describe('parseUnit', () => {

    it('should return a dictionary of formula transform', () => {

      const model = parseUnitModel({
        "data": {"values": []},
        "mark": "point",
        "encoding": {
          "x": {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const timeUnitComponent = timeUnit.parseUnit(model);
      assert.deepEqual(timeUnitComponent,
        {
          month_a: {
            type: 'formula',
            as: 'month_a',
            expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
          }
        }
      );
    });
  });

  describe('parseFacet', () => {
    // TODO:
  });

  describe('parseLayer', () => {
    // TODO:
  });

  describe('assemble', () => {
    // TODO:
  });
});

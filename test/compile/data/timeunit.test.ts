/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {timeUnit} from '../../../src/compile/data/timeunit';

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
            field: 'month_a',
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

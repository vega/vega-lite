/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, SIZE} from '../../../src/channel';
import * as properties from '../../../src/compile/legend/properties';

describe('compile/legend', function() {
  describe('values()', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = properties.values({values: [{year: 1970}, {year: 1980}]});

      assert.deepEqual(values, [
        {"signal": "datetime(1970, 0, 1, 0, 0, 0, 0)"},
        {"signal": "datetime(1980, 0, 1, 0, 0, 0, 0)"},
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = properties.values({values: [1,2,3,4]});

      assert.deepEqual(values, [1,2,3,4]);
    });

  });
});

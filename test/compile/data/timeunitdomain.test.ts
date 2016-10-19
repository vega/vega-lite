/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataComponent} from '../../../src/compile/data/data';
import {timeUnitDomain} from '../../../src/compile/data/timeunitdomain';

import {mockDataComponent} from './datatestutil';


describe('compile/data/timeunitdomain', () => {
  describe('assemble', () => {
    let component: DataComponent = mockDataComponent();
    component.timeUnitDomain = {
      month: true
    };

    it('should return correct data sources', () => {
      assert.deepEqual(timeUnitDomain.assemble(component),
        [
          {
            name: 'month',
            values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            transform: [{
              type: 'formula',
              field: 'date',
              expr: 'datetime(0, datum["data"], 1, 0, 0, 0, 0)'
            }]
          }
        ]
      );
    });
  });
});

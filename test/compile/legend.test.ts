/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as legend from '../../src/compile/legend';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title({field: 'a', legend: {title: 'Custom'}});
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      var title = legend.title({field: 'a', legend: {}});
      assert.deepEqual(title, 'a');
    });
  });
});

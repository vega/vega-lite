import {expect} from 'chai';

import * as legend from '../../src/compiler/legend';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title({field: 'a', legend: {title: 'Custom'}});
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var title = legend.title({field: 'a', legend: {}});
      expect(title).to.eql('a');
    });
  });
});

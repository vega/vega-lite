import {expect} from 'chai';

import * as legend from '../../src/compiler/legend';
import Encoding from '../../src/Encoding';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title(Encoding.fromSpec({
          encoding: {
            color: {name: 'a', legend: {title: 'Custom'}}
          }
        }), 'color');
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var encoding = Encoding.fromSpec({
          encoding: {
            color: {name: 'a', legend: {}}
          }
        });

      var title = legend.title(encoding, 'color');
      expect(title).to.eql('a');
    });
  });
});

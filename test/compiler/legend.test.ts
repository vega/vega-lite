import {expect} from 'chai';

import * as legend from '../../src/compiler/legend';
import {Model} from '../../src/compiler/Model';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title(Model.fromSpec({
          encoding: {
            color: {name: 'a', legend: {title: 'Custom'}}
          }
        }), 'color');
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var encoding = Model.fromSpec({
          encoding: {
            color: {name: 'a', legend: {}}
          }
        });

      var title = legend.title(encoding, 'color');
      expect(title).to.eql('a');
    });
  });
});

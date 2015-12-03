import {expect} from 'chai';

import * as legend from '../../src/compiler/legend';
import {Model} from '../../src/compiler/Model';
import {COLOR} from '../../src/channel';

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title(new Model({
          encoding: {
            color: {field: 'a', legend: {title: 'Custom'}}
          }
        }), COLOR);
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var encoding = new Model({
          encoding: {
            color: {field: 'a', legend: {}}
          }
        });

      var title = legend.title(encoding, COLOR);
      expect(title).to.eql('a');
    });
  });
});

import {expect} from 'chai';

import * as time from '../../src/compiler/time';
import Encoding from '../../src/Encoding';

describe('time', function() {
  var field = 'a',
    timeUnit = 'month',
    encoding = Encoding.fromSpec({
      encoding: {
        x: {name: field, type: 'temporal', timeUnit: timeUnit}
      }
    });

  describe('maxLength', function() {
    it('should return max length of abbreviated months', function () {
      expect(time.maxLength({timeUnit: 'month', axis: {abbreviatedTimeNames: true}}, Encoding.fromSpec({mark: 'point'})))
        .to.eql(3);
    });

    it('should return max length of abbreviated days of the week', function () {
      expect(time.maxLength({timeUnit: 'day',  axis: {abbreviatedTimeNames: true}}, Encoding.fromSpec({mark: 'point'})))
        .to.eql(3);
    });

    it('should return max length of months', function () {
      expect(time.maxLength({timeUnit: 'month', axis: {abbreviatedTimeNames: false}}, Encoding.fromSpec({mark: 'point'})))
        .to.eql(10);  // FIXME
    });

    it('should return max length of days of the week', function () {
      expect(time.maxLength({timeUnit: 'day',  axis: {abbreviatedTimeNames: false}}, Encoding.fromSpec({mark: 'point'})))
        .to.eql(10);  // FIXME
    });
  });
});

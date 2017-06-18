/* tslint:disable:quotemark */

import {assert} from 'chai';

import {AxisOrient} from '../../../src/axis';
import * as encode from '../../../src/compile/axis/encode';
import {labelAlign} from '../../../src/compile/axis/encode';
import {parseUnitModelWithScale} from '../../util';


describe('compile/axis', () => {
  describe('encode.labels()', function () {
    it('should rotate label for temporal field by default', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      assert.equal(labels.angle.value, 270);
    });

    it('should have correct text.signal for quarter timeUnits', function () {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "quarter"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      const expected = "'Q' + quarter(datum.value)";
      assert.equal(labels.text.signal, expected);
    });

    it('should have correct text.signal for yearquartermonth timeUnits', function () {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "yearquartermonth"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      const expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
      assert.equal(labels.text.signal, expected);
    });
  });

  describe('labelAlign', () => {
    function testLabelAlign(angle: number, orient: AxisOrient) {
      // Make angle within [0,360)
      angle = ((angle % 360) + 360) % 360;
      return labelAlign(angle, orient);
    }

    it('is left for bottom axis with positive angle', () => {
      assert.equal(testLabelAlign(90, 'bottom'), 'left');
      assert.equal(testLabelAlign(45, 'bottom'), 'left');
    });

    it('is right for bottom axis with negative angle', () => {
      assert.equal(testLabelAlign(-90, 'bottom'), 'right');
      assert.equal(testLabelAlign(-45, 'bottom'), 'right');
    });

    it('is left for top axis with positive angle', () => {
      assert.equal(testLabelAlign(90, 'top'), 'right');
      assert.equal(testLabelAlign(45, 'top'), 'right');
    });

    it('is left for top axis with negative angle', () => {
      assert.equal(testLabelAlign(-90, 'top'), 'left');
      assert.equal(testLabelAlign(-45, 'top'), 'left');
    });
  });
});

/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as encode from '../../../src/compile/axis/encode';
import {labelAlign, labelBaseline} from '../../../src/compile/axis/encode';
import {parseUnitModelWithScale} from '../../util';


describe('compile/axis', () => {
  describe('encode.labels()', function () {
    it('should not rotate label for temporal field by default', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      assert.isUndefined(labels.angle);
    });

    it('should do not rotate label for temporal field if labelAngle is specified in axis config', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        },
        config: {axisX: {labelAngle: 90}}
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      assert.isUndefined(labels.angle);
    });

    it('should have correct text.signal for quarter timeUnits', function () {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "quarter"}
        }
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
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
      const labels = encode.labels(model, 'x', {}, 'bottom');
      const expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
      assert.equal(labels.text.signal, expected);
    });
  });

  describe('labelAlign', () => {
    it('is left for bottom axis with positive angle', () => {
      assert.equal(labelAlign(90, 'bottom'), 'left');
      assert.equal(labelAlign(45, 'bottom'), 'left');
    });

    it('is right for bottom axis with negative angle', () => {
      assert.equal(labelAlign(-90, 'bottom'), 'right');
      assert.equal(labelAlign(-45, 'bottom'), 'right');
    });

    it('is left for top axis with positive angle', () => {
      assert.equal(labelAlign(90, 'top'), 'right');
      assert.equal(labelAlign(45, 'top'), 'right');
    });

    it('is left for top axis with negative angle', () => {
      assert.equal(labelAlign(-90, 'top'), 'left');
      assert.equal(labelAlign(-45, 'top'), 'left');
    });

    it('is center for bottom axis with 0 or 180', () => {
      assert.equal(labelAlign(0, 'top'), 'center');
      assert.equal(labelAlign(180, 'top'), 'center');
    });

    it('is center for vertical orient with 90 or -90', () => {
      assert.equal(labelAlign(90, 'right'), 'center');
      assert.equal(labelAlign(-90, 'left'), 'center');
    });

    it('is right for left axis for the the 1st and 4th quadrant', () => {
      assert.equal(labelAlign(80, 'left'), 'right');
      assert.equal(labelAlign(-80, 'left'), 'right');
    });

    it('is left for left axis for the the 2nd and 3rd quadrant', () => {
      assert.equal(labelAlign(100, 'left'), 'left');
      assert.equal(labelAlign(-100, 'left'), 'left');
    });

    describe('labelBaseline', () => {
      it('is middle for perpendiculars horizontal orients', () => {
        assert.deepEqual(labelBaseline(90, 'top'), {value: 'middle'});
        assert.deepEqual(labelBaseline(270, 'bottom'), {value: 'middle'});
      });


      it('is top for bottom orients for 1st and 4th quadrants', () => {
        assert.deepEqual(labelBaseline(80, 'bottom'), {value: 'top'});
        assert.deepEqual(labelBaseline(280, 'bottom'), {value: 'top'});
      });

      it('is bottom for bottom orients for 2nd and 3rd quadrants', () => {
        assert.deepEqual(labelBaseline(100, 'bottom'), {value: 'bottom'});
        assert.deepEqual(labelBaseline(260, 'bottom'), {value: 'bottom'});
      });

      it('is middle for 0 and 180 horizontal orients', () => {
        assert.deepEqual(labelBaseline(0, 'left'), {value: 'middle'});
        assert.deepEqual(labelBaseline(180, 'right'), {value: 'middle'});
      });


      it('is top for bottom orients for 1st and 2nd quadrants', () => {
        assert.deepEqual(labelBaseline(80, 'left'), {value: 'top'});
        assert.deepEqual(labelBaseline(100, 'left'), {value: 'top'});
      });

      it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
        assert.deepEqual(labelBaseline(280, 'left'), {value: 'bottom'});
        assert.deepEqual(labelBaseline(260, 'left'), {value: 'bottom'});
      });
    });
  });
});

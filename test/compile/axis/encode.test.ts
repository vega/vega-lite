/* tslint:disable:quotemark */

import * as encode from '../../../src/compile/axis/encode';
import {parseUnitModelWithScale} from '../../util';

describe('compile/axis/encode', () => {
  describe('encode.labels()', () => {
    it('should not rotate label for temporal field by default', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      expect(labels.angle).not.toBeDefined();
    });

    it('should do not rotate label for temporal field if labelAngle is specified in axis config', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        },
        config: {axisX: {labelAngle: 90}}
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      expect(labels.angle).not.toBeDefined();
    });

    it('should have correct text.signal for quarter timeUnits', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'quarter'}
        }
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      const expected = "'Q' + quarter(datum.value)";
      expect(labels.text.signal).toEqual(expected);
    });

    it('should have correct text.signal for yearquartermonth timeUnits', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'yearquartermonth'}
        }
      });
      const labels = encode.labels(model, 'x', {}, 'bottom');
      const expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
      expect(labels.text.signal).toEqual(expected);
    });
  });
});

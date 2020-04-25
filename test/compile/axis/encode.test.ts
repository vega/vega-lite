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
      const labels = encode.labels(model, 'x', {});
      expect(labels?.angle).toBeUndefined();
    });

    it('should do not rotate label for temporal field if labelAngle is specified in axis config', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        },
        config: {axisX: {labelAngle: 90}}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels?.angle).toBeUndefined();
    });

    it('applies custom format type', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', axis: {format: 'abc', formatType: 'customNumberFormat'}}
        },
        config: {customFormatTypes: true}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels.text.signal).toEqual('customNumberFormat(datum.value, "abc")');
    });
  });
});

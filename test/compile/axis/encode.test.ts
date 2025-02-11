import * as encode from '../../../src/compile/axis/encode/index.js';
import {parseUnitModelWithScale} from '../../util.js';

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
      expect(labels.text.signal).toBe('customNumberFormat(datum.value, "abc")');
    });

    it('applies custom format type without format', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', axis: {formatType: 'customNumberFormat'}}
        },
        config: {customFormatTypes: true}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels.text.signal).toBe('customNumberFormat(datum.value)');
    });

    it('applies custom format type from config', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        },
        config: {customFormatTypes: true, numberFormat: 'abc', numberFormatType: 'customNumberFormat'}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels.text.signal).toBe('customNumberFormat(datum.value, "abc")');
    });

    it('applies custom format type from a normalized stack', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', stack: 'normalize'}
        },
        config: {
          customFormatTypes: true,
          normalizedNumberFormat: 'abc',
          normalizedNumberFormatType: 'customNumberFormat'
        }
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels.text.signal).toBe('customNumberFormat(datum.value, "abc")');
    });

    it('applies custom timeFormatType from config', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal'}
        },
        config: {customFormatTypes: true, timeFormat: 'abc', timeFormatType: 'customTimeFormat'}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels.text.signal).toBe('customTimeFormat(datum.value, "abc")');
    });

    it('prefers timeUnit over timeFormatType from config', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'date'}
        },
        config: {customFormatTypes: true, timeFormat: 'abc', timeFormatType: 'customTimeFormat'}
      });
      const labels = encode.labels(model, 'x', {});
      expect(labels).toEqual({});
    });
  });
});

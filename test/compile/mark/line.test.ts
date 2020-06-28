import {COLOR, X, Y} from '../../../src/channel';
import {line} from '../../../src/compile/mark/line';
import * as log from '../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Line', () => {
  describe('with x, y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/barley.json'},
      mark: 'line',
      encoding: {
        x: {field: 'year', type: 'ordinal'},
        y: {field: 'yield', type: 'quantitative'}
      }
    });
    const props = line.encodeEntry(model);

    it('should have scale for x', () => {
      expect(props.x).toEqual({scale: X, field: 'year'});
    });

    it('should have scale for y', () => {
      expect(props.y).toEqual({scale: Y, field: 'yield'});
    });
  });

  describe('with x, y, color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/barley.json'},
      mark: 'line',
      encoding: {
        x: {field: 'year', type: 'ordinal'},
        y: {field: 'yield', type: 'quantitative'},
        color: {field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = line.encodeEntry(model);

    it('should have scale for color', () => {
      expect(props.stroke).toEqual({scale: COLOR, field: 'Acceleration'});
    });
  });

  describe('with x, y, size', () => {
    it('should have scale for size', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/barley.json'},
        mark: 'line',
        encoding: {
          x: {field: 'year', type: 'ordinal'},
          y: {field: 'yield', type: 'quantitative', aggregate: 'mean'},
          size: {field: 'variety', type: 'quantitative'}
        }
      });
      const props = line.encodeEntry(model);

      expect(props.strokeWidth).toEqual({scale: 'size', field: 'variety'});
    });

    it(
      'should drop aggregate size field',
      log.wrap(localLogger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          data: {url: 'data/barley.json'},
          mark: 'line',
          encoding: {
            x: {field: 'year', type: 'ordinal'},
            y: {field: 'yield', type: 'quantitative', aggregate: 'mean'},
            size: {field: 'Acceleration', type: 'quantitative', aggregate: 'mean'}
          }
        });
        const props = line.encodeEntry(model);

        // If size field is dropped, then strokeWidth only have value
        expect(props.strokeWidth && props.strokeWidth['scale']).toBeFalsy();
        expect(localLogger.warns[0]).toEqual(log.message.LINE_WITH_VARYING_SIZE);
      })
    );
  });

  describe('with stacked y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/barley.json'},
      mark: 'line',
      encoding: {
        x: {field: 'year', type: 'ordinal'},
        y: {field: 'yield', type: 'quantitative', aggregate: 'sum', stack: 'zero'},
        color: {field: 'a', type: 'nominal'}
      }
    });
    const props = line.encodeEntry(model);

    it('should use y_end', () => {
      expect(props.y).toEqual({scale: Y, field: 'sum_yield_end'});
    });
  });

  describe('with stacked x', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/barley.json'},
      mark: 'line',
      encoding: {
        y: {field: 'year', type: 'ordinal'},
        x: {field: 'yield', type: 'quantitative', aggregate: 'sum', stack: 'zero'},
        color: {field: 'a', type: 'nominal'}
      }
    });
    const props = line.encodeEntry(model);

    it('should use x_end', () => {
      expect(props.x).toEqual({scale: X, field: 'sum_yield_end'});
    });
  });

  describe('with x', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'line',
      encoding: {x: {field: 'year', type: 'ordinal'}},
      data: {url: 'data/barley.json'}
    });

    const props = line.encodeEntry(model);

    it('should be centered on y', () => {
      expect(props.y).toEqual({
        mult: 0.5,
        signal: 'height'
      });
    });

    it('should scale on x', () => {
      expect(props.x).toEqual({scale: X, field: 'year'});
    });
  });

  describe('with y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'line',
      encoding: {y: {field: 'year', type: 'ordinal'}},
      data: {url: 'data/barley.json'}
    });

    const props = line.encodeEntry(model);

    it('should be centered on x', () => {
      expect(props.x).toEqual({
        mult: 0.5,
        signal: 'width'
      });
    });

    it('should scale on y', () => {
      expect(props.y).toEqual({scale: Y, field: 'year'});
    });
  });
});

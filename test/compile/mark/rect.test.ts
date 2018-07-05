/* tslint:disable quotemark */
import {assert} from 'chai';
import {rect} from '../../../src/compile/mark/rect';
import * as log from '../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Rect', () => {
  describe('simple vertical', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar, with y from zero to field value and x band', () => {
      assert.deepEqual(props.x, {scale: 'x', field: 'Origin'});
      assert.deepEqual(props.width, {scale: 'x', band: true});
      assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
      assert.isUndefined(props.height);
    });
  });

  describe('simple horizontal', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar from zero to field value and y band', () => {
      assert.deepEqual(props.y, {scale: 'y', field: 'Origin'});
      assert.deepEqual(props.height, {scale: 'y', band: true});
      assert.deepEqual(props.x, {scale: 'x', field: 'mean_Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('simple horizontal with size field', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'},
        size: {aggregate: 'mean', field: 'Horsepower', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    log.wrap(localLogger => {
      it('should draw bar from zero to field value and with band value for x/width', () => {
        assert.deepEqual(props.y, {scale: 'y', field: 'Origin'});
        assert.deepEqual(props.height, {scale: 'y', band: true});
        assert.deepEqual(props.x, {scale: 'x', field: 'mean_Acceleration'});
        assert.deepEqual(props.x2, {scale: 'x', value: 0});
        assert.isUndefined(props.width);
      });

      it('should throw warning', () => {
        assert.equal(localLogger.warns[0], log.message.cannotApplySizeToNonOrientedMark('rect'));
      });
    });
  });

  describe('horizontal bin', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {bin: true, field: 'Horsepower', type: 'quantitative'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.height);
    });
  });

  describe('vertical bin', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        x: {bin: true, field: 'Horsepower', type: 'quantitative'},
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      assert.deepEqual(props.x2, {scale: 'x', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.width);
    });
  });

  describe('simple ranged', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {aggregate: 'min', field: 'Horsepower', type: 'quantitative'},
        y2: {aggregate: 'max', field: 'Horsepower', type: 'quantitative'},
        x: {aggregate: 'min', field: 'Acceleration', type: 'quantitative'},
        x2: {aggregate: 'max', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw rectangle with x, x2, y, y2', () => {
      assert.deepEqual(props.x, {scale: 'x', field: 'min_Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', field: 'max_Acceleration'});
      assert.deepEqual(props.y, {scale: 'y', field: 'min_Horsepower'});
      assert.deepEqual(props.y2, {scale: 'y', field: 'max_Horsepower'});
    });
  });

  describe('simple heatmap', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {field: 'Origin', type: 'ordinal'},
        x: {field: 'Cylinders', type: 'ordinal'},
        color: {aggregate: 'mean', field: 'Horsepower', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw rect with x and y bands', () => {
      assert.deepEqual(props.x, {scale: 'x', field: 'Cylinders'});
      assert.deepEqual(props.width, {scale: 'x', band: true});
      assert.deepEqual(props.y, {scale: 'y', field: 'Origin'});
      assert.deepEqual(props.height, {scale: 'y', band: true});
    });
  });

  describe('vertical binned data', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        x2: {
          field: 'bin_end',
          type: 'quantitative'
        },
        y: {
          field: 'count',
          type: 'quantitative'
        }
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      assert.deepEqual(props.x2, {scale: 'x', field: 'bin_start', offset: 0});
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_end', offset: 0});
      assert.deepEqual(props.y, {scale: 'y', field: 'count'});
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('horizontal binned data', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        y: {
          field: 'bin_start',
          bin: 'binned',
          type: 'quantitative',
          axis: {
            tickStep: 2
          }
        },
        y2: {
          field: 'bin_end',
          type: 'quantitative'
        },
        x: {
          field: 'count',
          type: 'quantitative'
        }
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_start', offset: 0});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_end', offset: 0});
      assert.deepEqual(props.x, {scale: 'x', field: 'count'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
    });
  });
});

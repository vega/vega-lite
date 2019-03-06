/* tslint:disable quotemark */
import {rect} from '../../../src/compile/mark/rect';
import {fieldInvalidTestValueRef} from '../../../src/compile/mark/valueref';
import {PositionFieldDef} from '../../../src/fielddef';
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
      expect(props.x).toEqual({scale: 'x', field: 'Origin'});
      expect(props.width).toEqual({scale: 'x', band: true});
      expect(props.y).toEqual({scale: 'y', field: 'mean_Acceleration'});
      expect(props.y2).toEqual({scale: 'y', value: 0});
      expect(props.height).toBeUndefined();
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
      expect(props.y).toEqual({scale: 'y', field: 'Origin'});
      expect(props.height).toEqual({scale: 'y', band: true});
      expect(props.x).toEqual({scale: 'x', field: 'mean_Acceleration'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
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
        expect(props.y).toEqual({scale: 'y', field: 'Origin'});
        expect(props.height).toEqual({scale: 'y', band: true});
        expect(props.x).toEqual({scale: 'x', field: 'mean_Acceleration'});
        expect(props.x2).toEqual({scale: 'x', value: 0});
        expect(props.width).toBeUndefined();
      });

      it('should throw warning', () => {
        expect(localLogger.warns[0]).toEqual(log.message.cannotApplySizeToNonOrientedMark('rect'));
      });
    });
  });

  describe('horizontal bin', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      expect(props.y2).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.y).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.height).toBeUndefined();
    });
  });

  describe('vertical bin', () => {
    const x: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        x,
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      expect(props.x2).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.x).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.width).toBeUndefined();
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
      expect(props.x).toEqual({scale: 'x', field: 'min_Acceleration'});
      expect(props.x2).toEqual({scale: 'x', field: 'max_Acceleration'});
      expect(props.y).toEqual({scale: 'y', field: 'min_Horsepower'});
      expect(props.y2).toEqual({scale: 'y', field: 'max_Horsepower'});
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
      expect(props.x).toEqual({scale: 'x', field: 'Cylinders'});
      expect(props.width).toEqual({scale: 'x', band: true});
      expect(props.y).toEqual({scale: 'y', field: 'Origin'});
      expect(props.height).toEqual({scale: 'y', band: true});
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
            tickMinStep: 2
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
      expect(props.x2).toEqual({scale: 'x', field: 'bin_start'});
      expect(props.x).toEqual({scale: 'x', field: 'bin_end'});
      expect(props.y).toEqual({scale: 'y', field: 'count'});
      expect(props.y2).toEqual({scale: 'y', value: 0});
      expect(props.width).toBeUndefined();
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
            tickMinStep: 2
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
      expect(props.y2).toEqual({scale: 'y', field: 'bin_start'});
      expect(props.y).toEqual({scale: 'y', field: 'bin_end'});
      expect(props.x).toEqual({scale: 'x', field: 'count'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
    });
  });
});

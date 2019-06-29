import {PositionFieldDef} from '../../../src/channeldef';
import {rect} from '../../../src/compile/mark/rect';
import {fieldInvalidTestValueRef} from '../../../src/compile/mark/valueref';
import * as log from '../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Rect', () => {
  describe('simple with width and height', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: {type: 'rect', width: 50, height: 49},
      encoding: {
        x: {field: 'x', type: 'quantitative'},
        y: {type: 'quantitative', field: 'y'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw centered rect ', () => {
      expect(props.x).toEqual({scale: 'x', field: 'x'});
      expect(props.width).toEqual({value: 50});
      expect(props.y).toEqual({scale: 'y', field: 'y'});
      expect(props.height).toEqual({value: 49});
    });
  });

  describe('simple with fixed x2 and y2', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: {type: 'rect', x2: -1, y2: -2},
      encoding: {
        x: {field: 'x', type: 'quantitative'},
        y: {type: 'quantitative', field: 'y'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw centered rect ', () => {
      expect(props.x).toEqual({scale: 'x', field: 'x'});
      expect(props.x2).toEqual({value: -1});
      expect(props.y).toEqual({scale: 'y', field: 'y'});
      expect(props.y2).toEqual({value: -2});
    });
  });

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

  describe('simple vertical 1D', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'rect',
      encoding: {
        y: {type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw bar, with y from zero to field value and x band', () => {
      expect(props).toMatchObject({
        x: {field: {group: 'width'}},
        x2: {value: 0},
        y: {scale: 'y', field: 'mean_Acceleration'},
        y2: {scale: 'y', value: 0}
      });
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
        y: {field: 'hp1', type: 'quantitative'},
        y2: {field: 'hp2'},
        x: {field: 'origin1', type: 'ordinal'},
        x2: {field: 'origin2'}
      }
    });
    const props = rect.encodeEntry(model);

    it('should draw rectangle with x, x2, y, y2', () => {
      expect(props.x).toEqual({scale: 'x', field: 'origin1', band: 0.5});
      expect(props.x2).toEqual({scale: 'x', field: 'origin2', band: 0.5});
      expect(props.y).toEqual({scale: 'y', field: 'hp1'});
      expect(props.y2).toEqual({scale: 'y', field: 'hp2'});
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

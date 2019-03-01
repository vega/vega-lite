/* tslint:disable quotemark */

import {bar} from '../../../src/compile/mark/bar';
import {fieldInvalidPredicate, fieldInvalidTestValueRef} from '../../../src/compile/mark/valueref';
import {PositionFieldDef, SecondaryFieldDef} from '../../../src/fielddef';
import * as log from '../../../src/log';
import {defaultBarConfig} from '../../../src/mark';
import {defaultScaleConfig} from '../../../src/scale';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Bar', () => {
  describe('simple vertical', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar, with y from zero to field value and with band value for x/width ', () => {
      expect(props.x).toEqual({scale: 'x', field: 'Origin'});
      expect(props.width).toEqual({scale: 'x', band: true});
      expect(props.y).toEqual({scale: 'y', field: 'mean_Acceleration'});
      expect(props.y2).toEqual({scale: 'y', value: 0});
      expect(props.height).toBeUndefined();
    });
  });

  it('should draw vertical bar, with y from zero to field value and bar with quantitative x, x2, and y', () => {
    const x: PositionFieldDef<string> = {field: 'bin_start', type: 'quantitative'};
    const x2: SecondaryFieldDef<string> = {field: 'bin_end'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        x2,
        y: {type: 'quantitative', field: 'Acceleration'}
      }
    });
    const props = bar.encodeEntry(model);
    expect(props.x).toEqual([{test: fieldInvalidPredicate(x), value: 0}, {scale: 'x', field: 'bin_start'}]);
    expect(props.x2).toEqual([{test: fieldInvalidPredicate(x2), value: 0}, {scale: 'x', field: 'bin_end'}]);
    expect(props.y).toEqual({scale: 'y', field: 'Acceleration'});
    expect(props.y2).toEqual({scale: 'y', value: 0});
    expect(props.height).toBeUndefined();
  });

  it('should draw vertical bar, with y from zero to field value and with band value for x/width when domain that includes zero is specified', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {type: 'quantitative', field: 'Acceleration', aggregate: 'mean', scale: {domain: [-1, 1]}}
      }
    });
    const props = bar.encodeEntry(model);

    expect(props.x).toEqual({scale: 'x', field: 'Origin'});
    expect(props.width).toEqual({scale: 'x', band: true});
    expect(props.y).toEqual({scale: 'y', field: 'mean_Acceleration'});
    expect(props.y2).toEqual({scale: 'y', value: 0});
    expect(props.height).toBeUndefined();
  });

  it(
    'should draw vertical bar, with y from "group: height" to field value when domain that excludes zero is specified',
    log.wrap(logger => {
      const y: PositionFieldDef<string> = {
        type: 'quantitative',
        field: 'Acceleration',
        aggregate: 'mean',
        scale: {domain: [1, 2]}
      };
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y
        }
      });
      const props = bar.encodeEntry(model);

      expect(props.y).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'mean_Acceleration'}]);
      expect(props.y2).toEqual({field: {group: 'height'}});
      expect(props.height).toBeUndefined();

      expect(logger.warns[0]).toEqual(log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {zeroFalse: false}));
    })
  );

  it(
    'should draw vertical bar, with y from "group: height" to field value when zero=false for y-scale',
    log.wrap(logger => {
      const y: PositionFieldDef<string> = {
        type: 'quantitative',
        field: 'Acceleration',
        aggregate: 'mean',
        scale: {zero: false}
      };
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y
        }
      });
      const props = bar.encodeEntry(model);

      expect(props.y).toEqual([
        {test: fieldInvalidPredicate(y), field: {group: 'height'}},
        {scale: 'y', field: 'mean_Acceleration'}
      ]);
      expect(props.y2).toEqual({field: {group: 'height'}});
      expect(props.height).toBeUndefined();

      expect(logger.warns[0]).toEqual(log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {zeroFalse: true}));
    })
  );

  it(
    'should draw vertical bar, with y from "group: height" to field value when y-scale type is log',
    log.wrap(logger => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {type: 'quantitative', field: 'Acceleration', aggregate: 'mean', scale: {type: 'log'}}
        }
      });
      const props = bar.encodeEntry(model);

      expect(props.y).toEqual({scale: 'y', field: 'mean_Acceleration'});
      expect(props.y2).toEqual({field: {group: 'height'}});
      expect(props.height).toBeUndefined();

      expect(logger.warns[0]).toEqual(log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {scaleType: 'log'}));
    })
  );

  describe('simple horizontal', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar from zero to field value and with band value for x/width', () => {
      expect(props.y).toEqual({scale: 'y', field: 'Origin'});
      expect(props.height).toEqual({scale: 'y', band: true});
      expect(props.x).toEqual({scale: 'x', field: 'mean_Acceleration'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
    });
  });

  it('should draw horizontal bar, with y from zero to field value and bar with quantitative x, x2, and y', () => {
    const y: PositionFieldDef<string> = {field: 'bin_start', type: 'quantitative'};
    const y2: PositionFieldDef<string> = {field: 'bin_end', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        y2,
        x: {type: 'quantitative', field: 'Acceleration'}
      }
    });
    const props = bar.encodeEntry(model);
    expect(props.y).toEqual([
      {test: fieldInvalidPredicate(y), field: {group: 'height'}},
      {scale: 'y', field: 'bin_start'}
    ]);
    expect(props.y2).toEqual([
      {test: fieldInvalidPredicate(y2), field: {group: 'height'}},
      {scale: 'y', field: 'bin_end'}
    ]);
    expect(props.x).toEqual({scale: 'x', field: 'Acceleration'});
    expect(props.x2).toEqual({scale: 'x', value: 0});
    expect(props.height).toBeUndefined();
  });

  describe('simple horizontal with point scale', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal', scale: {type: 'point'}},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar from zero to field value and y with center position and height = rangeStep - 1', () => {
      expect(props.yc).toEqual({scale: 'y', field: 'Origin'});
      expect(props.height).toEqual({value: defaultScaleConfig.rangeStep - 1});
      expect(props.x).toEqual({scale: 'x', field: 'mean_Acceleration'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
    });
  });

  describe('simple horizontal with size value', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'},
        size: {value: 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should set height to 5 and center y', () => {
      expect(props.height).toEqual({value: 5});
      expect(props.yc).toEqual({scale: 'y', field: 'Origin', band: 0.5});
    });
  });

  describe('simple horizontal with size value in mark def', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: {type: 'bar', size: 5},
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should set height to 5 and center y', () => {
      expect(props.height).toEqual({value: 5});
      expect(props.yc).toEqual({scale: 'y', field: 'Origin', band: 0.5});
    });
  });

  describe('simple horizontal with size field', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'},
        size: {aggregate: 'mean', field: 'Horsepower', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar from zero to field value and with band value for x/width', () => {
      expect(props.yc).toEqual({scale: 'y', field: 'Origin', band: 0.5});
      expect(props.height).toEqual({scale: 'size', field: 'mean_Horsepower'});
      expect(props.x).toEqual({scale: 'x', field: 'mean_Acceleration'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
    });
  });

  describe('horizontal binned', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      expect(props.y2).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.y).toEqual([
        fieldInvalidTestValueRef(y, 'y'),
        {
          scale: 'y',
          field: 'bin_maxbins_10_Horsepower_end',
          offset: defaultBarConfig.binSpacing
        }
      ]);
      expect(props.height).toBeUndefined();
    });
  });

  describe('horizontal binned, sort descending', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative', sort: 'descending'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      expect(props.y2).toEqual([
        fieldInvalidTestValueRef(y, 'y'),
        {scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing}
      ]);
      expect(props.y).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.height).toBeUndefined();
    });
  });

  describe('horizontal binned, reverse', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative', scale: {reverse: true}};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      expect(props.y2).toEqual([
        fieldInvalidTestValueRef(y, 'y'),
        {scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing}
      ]);
      expect(props.y).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.height).toBeUndefined();
    });
  });

  describe('vertical binned', () => {
    const x: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};

    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      expect(props.x2).toEqual([
        fieldInvalidTestValueRef(x, 'x'),
        {scale: 'x', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing}
      ]);
      expect(props.x).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.width).toBeUndefined();
    });
  });

  describe('vertical binned, sort descending', () => {
    const x: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative', sort: 'descending'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      expect(props.x2).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.x).toEqual([
        fieldInvalidTestValueRef(x, 'x'),
        {
          scale: 'x',
          field: 'bin_maxbins_10_Horsepower_end',
          offset: defaultBarConfig.binSpacing
        }
      ]);
      expect(props.width).toBeUndefined();
    });
  });

  describe('horizontal binned with ordinal', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {bin: true, field: 'Horsepower', type: 'ordinal'},
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y', () => {
      expect(props.y).toEqual({scale: 'y', field: 'bin_maxbins_10_Horsepower_range'});
      expect(props.height).toEqual({scale: 'y', band: true});
    });
  });

  describe('vertical binned with ordinal', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {bin: true, field: 'Horsepower', type: 'ordinal'},
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y', () => {
      expect(props.x).toEqual({scale: 'x', field: 'bin_maxbins_10_Horsepower_range'});
      expect(props.width).toEqual({scale: 'x', band: true});
    });
  });

  describe('horizontal binned with no spacing', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      },
      config: {bar: {binSpacing: 0}}
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', () => {
      expect(props.y2).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.y).toEqual([fieldInvalidTestValueRef(y, 'y'), {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.height).toBeUndefined();
    });
  });

  describe('vertical binned with no spacing', () => {
    const x: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      },
      config: {bar: {binSpacing: 0}}
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', () => {
      expect(props.x2).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower'}]);
      expect(props.x).toEqual([fieldInvalidTestValueRef(x, 'x'), {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'}]);
      expect(props.width).toBeUndefined();
    });
  });

  describe('simple horizontal binned with size', () => {
    const y: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y,
        x: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'},
        size: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y centered on bin_mid and height = size field', () => {
      expect(props.yc).toEqual([
        {
          test: fieldInvalidPredicate(y),
          field: {group: 'height'}
        },
        {
          signal: 'scale("y", (datum["bin_maxbins_10_Horsepower"] + datum["bin_maxbins_10_Horsepower_end"]) / 2)'
        }
      ]);
      expect(props.height).toEqual({scale: 'size', field: 'mean_Acceleration'});
    });
  });

  describe('vertical binned with size', () => {
    const x: PositionFieldDef<string> = {bin: true, field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        y: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'},
        size: {aggregate: 'mean', field: 'Acceleration', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x centered on bin_mid and width = size field', () => {
      expect(props.xc).toEqual([
        {
          test: fieldInvalidPredicate(x),
          value: 0
        },
        {
          signal: 'scale("x", (datum["bin_maxbins_10_Horsepower"] + datum["bin_maxbins_10_Horsepower_end"]) / 2)'
        }
      ]);
      expect(props.width).toEqual({scale: 'size', field: 'mean_Acceleration'});
    });
  });

  describe('vertical, with log', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {scale: {type: 'log'}, type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should end on axis and has no height', () => {
      expect(props.y2).toEqual({field: {group: 'height'}});
      expect(props.height).toBeUndefined();
    });
  });

  describe('horizontal, with log', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {scale: {type: 'log'}, type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });

    const props = bar.encodeEntry(model);

    it('should end on axis and has no width', () => {
      expect(props.x2).toEqual({value: 0});
      expect(props.width).toBeUndefined();
    });
  });

  describe('vertical, with fit mode', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      width: 120,
      height: 120,
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {aggregate: 'mean', field: 'Horsepower', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should use x and with band true', () => {
      expect(props.x).toEqual({
        scale: 'x',
        field: 'Origin'
      });
      expect(props.width).toEqual({
        scale: 'x',
        band: true
      });
    });
  });

  describe('horizontal, with fit mode', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      width: 120,
      height: 120,
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {aggregate: 'mean', field: 'Horsepower', type: 'quantitative'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should use y with band true', () => {
      expect(props.y).toEqual({
        scale: 'y',
        field: 'Origin'
      });
      expect(props.height).toEqual({
        scale: 'y',
        band: true
      });
    });
  });

  describe('vertical with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {scale: {zero: false}, type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should end on axis nad have no height', () => {
      expect(props.y2).toEqual({field: {group: 'height'}});
      expect(props.height).toBeUndefined();
    });
  });

  describe('horizontal with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        y: {field: 'Origin', type: 'nominal'},
        x: {scale: {zero: false}, type: 'quantitative', field: 'Acceleration', aggregate: 'mean'}
      }
    });

    const props = bar.encodeEntry(model);
    it('should end on axis and have no width', () => {
      expect(props.x2).toEqual({value: 0});
      expect(props.width).toBeUndefined();
    });
  });

  describe('1D vertical', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}},
      data: {url: 'data/movies.json'}
    });
    const props = bar.encodeEntry(model);

    it('should have y end on axis, have no-height and have x-offset', () => {
      expect(props.y).toEqual({scale: 'y', field: 'sum_US_Gross'});
      expect(props.y2).toEqual({scale: 'y', value: 0});
      expect(props.height).toBeUndefined();
      expect(props.xc).toEqual({
        mult: 0.5,
        signal: 'width'
      });
    });
  });

  describe('1D vertical with size value', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'},
        size: {value: 5}
      },
      data: {url: 'data/movies.json'}
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({value: 5});
    });
  });

  describe('1D vertical with config.mark.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}
      },
      data: {url: 'data/movies.json'},
      config: {
        mark: {size: 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should not use config.mark.size', () => {
      expect(props.width).toEqual({value: 19});
    });
  });

  describe('1D vertical with config.bar.discreteBandSize', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/movies.json'},
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}
      },
      config: {
        bar: {discreteBandSize: 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({value: 5});
    });
  });

  describe('2D vertical with point scale and config.bar.discreteBandSize', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/movies.json'},
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'},
        x: {type: 'nominal', field: 'Major_Genre', scale: {type: 'point'}}
      },
      config: {
        bar: {discreteBandSize: 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({value: 5});
    });
  });

  describe('2D vertical with config.bar.discreteBandSize', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/movies.json'},
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'},
        x: {type: 'nominal', field: 'Major_Genre'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({scale: 'x', band: true});
    });
  });

  describe('1D vertical with config.bar.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/movies.json'},
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}
      },
      config: {
        bar: {size: 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({value: 5});
    });
  });

  describe('1D vertical with config.style.bar.size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/movies.json'},
      mark: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}
      },
      config: {
        style: {bar: {size: 5}}
      }
    });
    const props = bar.encodeEntry(model);

    it('should have width = 5', () => {
      expect(props.width).toEqual({value: 5});
    });
  });

  describe('1D horizontal', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {x: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'}},
      data: {url: 'data/movies.json'}
    });
    const props = bar.encodeEntry(model);

    it('should end on axis, have no width, and have y-offset', () => {
      expect(props.x).toEqual({scale: 'x', field: 'sum_US_Gross'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.width).toBeUndefined();
      expect(props.yc).toEqual({
        mult: 0.5,
        signal: 'height'
      });
    });
  });

  describe('QxQ horizontal', () => {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results
    const y: PositionFieldDef<string> = {field: 'Horsepower', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x: {field: 'Acceleration', type: 'quantitative'},
        y
      },
      config: {
        mark: {orient: 'horizontal'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should produce horizontal bar using x, x2', () => {
      expect(props.x).toEqual({scale: 'x', field: 'Acceleration'});
      expect(props.x2).toEqual({scale: 'x', value: 0});
      expect(props.yc).toEqual([
        {test: fieldInvalidPredicate(y), field: {group: 'height'}},
        {scale: 'y', field: 'Horsepower'}
      ]);
      expect(props.height).toEqual({value: defaultBarConfig.continuousBandSize});
    });
  });

  describe('QxQ vertical', () => {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results
    const x: PositionFieldDef<string> = {field: 'Acceleration', type: 'quantitative'};
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {url: 'data/cars.json'},
      mark: 'bar',
      encoding: {
        x,
        y: {field: 'Horsepower', type: 'quantitative'}
      },
      config: {
        mark: {orient: 'vertical'}
      }
    });
    const props = bar.encodeEntry(model);

    it('should produce horizontal bar using x, x2', () => {
      expect(props.xc).toEqual([{test: fieldInvalidPredicate(x), value: 0}, {scale: 'x', field: 'Acceleration'}]);
      expect(props.width).toEqual({value: defaultBarConfig.continuousBandSize});
      expect(props.y).toEqual({scale: 'y', field: 'Horsepower'});
      expect(props.y2).toEqual({scale: 'y', value: 0});
    });
  });

  describe('OxN', () => {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results
    it('should produce vertical bar using x, width', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'bar',
        encoding: {
          x: {field: 'Origin', type: 'nominal'},
          y: {field: 'Cylinders', type: 'ordinal'}
        }
      });
      const props = bar.encodeEntry(model);

      expect(props.x).toEqual({scale: 'x', field: 'Origin'});
      expect(props.width).toEqual({scale: 'x', band: true});
      expect(props.y).toEqual({scale: 'y', field: 'Cylinders'});
      expect(props.height).toEqual({scale: 'y', band: true});
    });
  });

  describe('ranged bar', () => {
    // TODO: gantt chart with temporal

    // TODO: gantt chart with ordinal

    it('vertical bars should work with aggregate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/population.json'},
        mark: 'bar',
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', aggregate: 'q1', type: 'quantitative'},
          y2: {field: 'people', aggregate: 'q3', type: 'quantitative'}
        }
      });

      const props = bar.encodeEntry(model);
      expect(props.x).toEqual({scale: 'x', field: 'age'});
      expect(props.y).toEqual({scale: 'y', field: 'q1_people'});
      expect(props.y2).toEqual({scale: 'y', field: 'q3_people'});
    });

    it('horizontal bars should work with aggregate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/population.json'},
        mark: 'bar',
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', aggregate: 'q1', type: 'quantitative'},
          x2: {field: 'people', aggregate: 'q3', type: 'quantitative'}
        }
      });

      const props = bar.encodeEntry(model);
      expect(props.y).toEqual({scale: 'y', field: 'age'});
      expect(props.x).toEqual({scale: 'x', field: 'q1_people'});
      expect(props.x2).toEqual({scale: 'x', field: 'q3_people'});
    });
  });

  describe('vertical binned data', () => {
    describe('default offset', () => {
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
      const props = bar.encodeEntry(model);

      it('should draw bar with x and x2', () => {
        expect(props.x2).toEqual({scale: 'x', field: 'bin_start', offset: 1});
        expect(props.x).toEqual({scale: 'x', field: 'bin_end'});
        expect(props.y).toEqual({scale: 'y', field: 'count'});
        expect(props.y2).toEqual({scale: 'y', value: 0});
        expect(props.width).toBeUndefined();
      });
    });

    describe('custom offset', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', binSpacing: 10},
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
      const props = bar.encodeEntry(model);

      it('should draw bar with x and x2', () => {
        expect(props.x2).toEqual({scale: 'x', field: 'bin_start', offset: 10});
        expect(props.x).toEqual({scale: 'x', field: 'bin_end'});
        expect(props.y).toEqual({scale: 'y', field: 'count'});
        expect(props.y2).toEqual({scale: 'y', value: 0});
        expect(props.width).toBeUndefined();
      });
    });
  });

  describe('horizontal binned data', () => {
    describe('default offset', () => {
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
      const props = bar.encodeEntry(model);

      it('should draw bar with y and y2', () => {
        expect(props.y2).toEqual({scale: 'y', field: 'bin_start'});
        expect(props.y).toEqual({scale: 'y', field: 'bin_end', offset: 1});
        expect(props.x).toEqual({scale: 'x', field: 'count'});
        expect(props.x2).toEqual({scale: 'x', value: 0});
        expect(props.width).toBeUndefined();
      });
    });

    describe('custom offset', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', binSpacing: 10},
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
      const props = bar.encodeEntry(model);

      it('should draw bar with y and y2', () => {
        expect(props.y2).toEqual({scale: 'y', field: 'bin_start'});
        expect(props.y).toEqual({scale: 'y', field: 'bin_end', offset: 10});
        expect(props.x).toEqual({scale: 'x', field: 'count'});
        expect(props.x2).toEqual({scale: 'x', value: 0});
        expect(props.width).toBeUndefined();
      });
    });
  });
});

/* tslint:disable quotemark */

import {assert} from 'chai';
import {bar} from '../../../src/compile/mark/bar';
import * as log from '../../../src/log';
import {defaultBarConfig} from '../../../src/mark';
import {defaultScaleConfig} from '../../../src/scale';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Bar', function() {
  describe('simple vertical', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"type": "quantitative", "field": 'Acceleration', "aggregate": "mean"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar, with y from zero to field value and with band value for x/width ', function() {
      assert.deepEqual(props.x, {scale: 'x', field: 'Origin'});
      assert.deepEqual(props.width, {scale: 'x', band: true});
      assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
      assert.isUndefined(props.height);
    });
  });

  it('should draw vertical bar, with y from zero to field value and with band value for x/width when domain that includes zero is specified', function () {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": {"domain": [-1, 1]}}
      }
    });
    const props = bar.encodeEntry(model);

    assert.deepEqual(props.x, {scale: 'x', field: 'Origin'});
    assert.deepEqual(props.width, {scale: 'x', band: true});
    assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
    assert.deepEqual(props.y2, {scale: 'y', value: 0});
    assert.isUndefined(props.height);
  });

  it('should draw vertical bar, with y from "group: height" to field value when domain that excludes zero is specified', log.wrap((logger) => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": {"domain": [1, 2]}}
      }
    });
    const props = bar.encodeEntry(model);

    assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
    assert.deepEqual(props.y2, {field: {group: 'height'}});
    assert.isUndefined(props.height);

    assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {zeroFalse: false}));
  }));

  it('should draw vertical bar, with y from "group: height" to field value when zero=false for y-scale', log.wrap((logger) => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": {"zero": false}}
      }
    });
    const props = bar.encodeEntry(model);

    assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
    assert.deepEqual(props.y2, {field: {group: 'height'}});
    assert.isUndefined(props.height);

    assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {zeroFalse: true}));
  }));

  it('should draw vertical bar, with y from "group: height" to field value when y-scale type is log', log.wrap((logger) => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": {"type": "log"}}
      }
    });
    const props = bar.encodeEntry(model);

    assert.deepEqual(props.y, {scale: 'y', field: 'mean_Acceleration'});
    assert.deepEqual(props.y2, {field: {group: 'height'}});
    assert.isUndefined(props.height);

    assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', {scaleType: 'log'}));
  }));

  describe('simple horizontal', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar from zero to field value and with band value for x/width', function() {
      assert.deepEqual(props.y, {scale: 'y', field: 'Origin'});
      assert.deepEqual(props.height, {scale: 'y', band: true});
      assert.deepEqual(props.x, {scale: 'x', field: 'mean_Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('simple horizontal with point scale', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal", "scale": {"type": "point"}},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar from zero to field value and y with center position and height = rangeStep - 1', function() {
      assert.deepEqual(props.yc, {scale: 'y', field: 'Origin'});
      assert.deepEqual(props.height, {value: defaultScaleConfig.rangeStep - 1});
      assert.deepEqual(props.x, {scale: 'x', field: 'mean_Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('simple horizontal with size value', function () {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"},
        "size": {"value": 5}
      }
    });
    const props = bar.encodeEntry(model);

    it('should set height to 5 and center y', function () {
      assert.deepEqual(props.height, {value: 5});
      assert.deepEqual(props.yc, {scale: 'y', field: 'Origin', band: 0.5});
    });
  });

  describe('simple horizontal with size value in mark def', function () {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": {"type": "bar", "size": 5},
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should set height to 5 and center y', function () {
      assert.deepEqual(props.height, {value: 5});
      assert.deepEqual(props.yc, {scale: 'y', field: 'Origin', band: 0.5});
    });
  });

  describe('simple horizontal with size field', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"},
        "size": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);


    it('should draw bar from zero to field value and with band value for x/width', function() {
      assert.deepEqual(props.yc, {scale: 'y', field: 'Origin', band: 0.5});
      assert.deepEqual(props.height, {scale: 'size', field: 'mean_Horsepower'});
      assert.deepEqual(props.x, {scale: 'x', field: 'mean_Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('horizontal binned', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', function() {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_end', offset: defaultBarConfig.binSpacing});
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal binned, sort descending', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', function() {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal binned, reverse', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "quantitative", "scale": {"reverse": true}},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', function() {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.height);
    });
  });

  describe('vertical binned', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "y": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', function() {
      assert.deepEqual(props.x2, {scale: 'x', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing});
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.width);
    });
  });

  describe('vertical binned, sort descending', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending"},
        "y": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', function() {
      assert.deepEqual(props.x2, {scale: 'x', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_maxbins_10_Horsepower_end', offset: defaultBarConfig.binSpacing});
      assert.isUndefined(props.width);
    });
  });


  describe('horizontal binned with ordinal', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "ordinal"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y', function() {
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_range'});
      assert.deepEqual(props.height, {scale: 'y', band: true});
    });
  });

  describe('vertical binned with ordinal', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "field": 'Horsepower', "type": "ordinal"},
        "y": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y', function() {
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_maxbins_10_Horsepower_range'});
      assert.deepEqual(props.width, {scale: 'x', band: true});
    });
  });


  describe('horizontal binned with no spacing', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      },
      "config": {"bar": {"binSpacing": 0}}
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y and y2', function() {
      assert.deepEqual(props.y2, {scale: 'y', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.y, {scale: 'y', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.height);
    });
  });

  describe('vertical binned with no spacing', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "y": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      },
      "config": {"bar": {"binSpacing": 0}}
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x and x2', function() {
      assert.deepEqual(props.x2, {scale: 'x', field: 'bin_maxbins_10_Horsepower'});
      assert.deepEqual(props.x, {scale: 'x', field: 'bin_maxbins_10_Horsepower_end'});
      assert.isUndefined(props.width);
    });
  });

  describe('simple horizontal binned with size', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "x": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"},
        "size": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with y centered on bin_mid and height = size field', function() {
      assert.deepEqual(props.yc, {signal: '(scale("y", datum["bin_maxbins_10_Horsepower"]) + scale("y", datum["bin_maxbins_10_Horsepower_end"]))/2'});
      assert.deepEqual(props.height, {scale: 'size', field: 'mean_Acceleration'});
    });
  });

  describe('vertical binned with size', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "field": 'Horsepower', "type": "quantitative"},
        "y": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"},
        "size": {"aggregate": "mean", "field": 'Acceleration', "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should draw bar with x centered on bin_mid and width = size field', function() {
      assert.deepEqual(props.xc, {signal: '(scale(\"x\", datum[\"bin_maxbins_10_Horsepower\"]) + scale(\"x\", datum[\"bin_maxbins_10_Horsepower_end\"]))/2'});
      assert.deepEqual(props.width, {scale: 'size', field: 'mean_Acceleration'});
    });
  });

  describe('vertical, with log', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should end on axis and has no height', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal, with log', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean"}
      }
    });

    const props = bar.encodeEntry(model);

    it('should end on axis and has no width', function() {
      assert.deepEqual(props.x2, {value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('vertical, with fit mode', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "width": 120,
      "height": 120,
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should use x and with band true', () => {
      assert.deepEqual(props.x, {
        scale: 'x',
        field: 'Origin',
      });
      assert.deepEqual(props.width, {
        scale: 'x',
        band: true,
      });
    });
  });

  describe('horizontal, with fit mode', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "width": 120,
      "height": 120,
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should use y with band true', () => {
      assert.deepEqual(props.y, {
        scale: 'y',
        field: 'Origin',
      });
      assert.deepEqual(props.height, {
        scale: 'y',
        band: true,
      });
    });
  });

  describe('vertical with zero=false', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "x": {"field": "Origin", "type": "nominal"},
        "y": {"scale": {"zero": false}, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean"}
      }
    });
    const props = bar.encodeEntry(model);

    it('should end on axis nad have no height', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal with zero=false', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "data": {"url": 'data/cars.json'},
      "mark": "bar",
      "encoding": {
        "y": {"field": "Origin", "type": "nominal"},
        "x": {"scale": {"zero": false}, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean"}
      }
    });

    const props = bar.encodeEntry(model);
    it('should end on axis and have no width', function() {
      assert.deepEqual(props.x2, {value: 0});
      assert.isUndefined(props.width);
    });
  });

  describe('1D vertical', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {"y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}},
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.encodeEntry(model);

    it('should have y end on axis, have no-height and have x-offset', function() {
      assert.deepEqual(props.y, {scale: 'y', field: 'sum_US_Gross'});
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
      assert.isUndefined(props.height);
      assert.deepEqual(props.xc, {
        mult: 0.5,
        signal: 'width'
      });
    });
  });

  describe('1D vertical with size value', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"},
          "size": {"value": 5}
        },
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.encodeEntry(model);

    it('should have width = 5', function() {
      assert.deepEqual(props.width, {value: 5});
    });
  });

  describe('1D vertical with barSize config', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": 'data/movies.json'},
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "config": {
          "bar": {"discreteBandSize": 5}
        }
      });
    const props = bar.encodeEntry(model);

    it('should have width = 5', function() {
      assert.deepEqual(props.width, {value: 5});
    });
  });

  describe('1D horizontal', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "bar",
      "encoding": {"x": {"type": "quantitative", "field": 'US_Gross', "aggregate": 'sum'}},
      "data": {"url": 'data/movies.json'}
    });
    const props = bar.encodeEntry(model);

    it('should end on axis, have no width, and have y-offset', function() {
      assert.deepEqual(props.x, {scale: 'x', field: 'sum_US_Gross'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.isUndefined(props.width);
      assert.deepEqual(props.yc, {
        mult: 0.5,
        signal: 'height'
      });
    });
  });

  describe('QxQ horizontal', function() {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results

    const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": 'data/cars.json'},
        "mark": "bar",
        "encoding": {
          "x": {"field": 'Acceleration', "type": "quantitative"},
          "y": {"field": 'Horsepower', "type": "quantitative"}
        },
        "config": {
          "mark": {"orient": "horizontal"}
        }
      });
    const props = bar.encodeEntry(model);

    it('should produce horizontal bar using x, x2', function() {
      assert.deepEqual(props.x, {scale: 'x', field: 'Acceleration'});
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
      assert.deepEqual(props.yc, {scale: 'y', field: 'Horsepower'});
      assert.deepEqual(props.height, {value: defaultBarConfig.continuousBandSize});
    });
  });

  describe('QxQ vertical', function() {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results

    const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": 'data/cars.json'},
        "mark": "bar",
        "encoding": {
          "x": {"field": 'Acceleration', "type": "quantitative"},
          "y": {"field": 'Horsepower', "type": "quantitative"}
        },
        "config": {
          "mark": {"orient": "vertical"}
        }
      });
    const props = bar.encodeEntry(model);

    it('should produce horizontal bar using x, x2', function() {
      assert.deepEqual(props.xc, {scale: 'x', field: 'Acceleration'});
      assert.deepEqual(props.width, {value: defaultBarConfig.continuousBandSize});
      assert.deepEqual(props.y, {scale: 'y', field: 'Horsepower'});
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
    });
  });

  describe('OxN', function() {
    // This is generally a terrible idea, but we should still test
    // if the output show expected results
    it('should produce vertical bar using x, width', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": 'data/cars.json'},
        "mark": "bar",
        "encoding": {
          "x": {"field": 'Origin', "type": "nominal"},
          "y": {"field": 'Cylinders', "type": "ordinal"}
        }
      });
      const props = bar.encodeEntry(model);

      assert.deepEqual(props.x, {scale: 'x', field: 'Origin'});
      assert.deepEqual(props.width, {scale: 'x', band: true});
      assert.deepEqual(props.y, {scale: 'y', field: 'Cylinders'});
      assert.deepEqual(props.height, {scale: 'y', band: true});
    });
  });

  describe('ranged bar', function() {
    // TODO: gantt chart with temporal

    // TODO: gantt chart with ordinal

    it('vertical bars should work with aggregate', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": "data/population.json"},
        "mark": "bar",
        "encoding": {
          "x": {"field": "age", "type": "ordinal"},
          "y": {"field": "people", "aggregate": "q1", "type": "quantitative"},
          "y2": {"field": "people", "aggregate": "q3", "type": "quantitative"}
        }
      });

      const props = bar.encodeEntry(model);
      assert.deepEqual(props.x, {scale: 'x', field: 'age'});
      assert.deepEqual(props.y, {scale: 'y', field: 'q1_people'});
      assert.deepEqual(props.y2, {scale: 'y', field: 'q3_people'});
    });

    it('horizontal bars should work with aggregate', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": "data/population.json"},
        "mark": "bar",
        "encoding": {
          "y": {"field": "age", "type": "ordinal"},
          "x": {"field": "people", "aggregate": "q1", "type": "quantitative"},
          "x2": {"field": "people", "aggregate": "q3", "type": "quantitative"}
        }
      });

      const props = bar.encodeEntry(model);
      assert.deepEqual(props.y, {scale: 'y', field: 'age'});
      assert.deepEqual(props.x, {scale: 'x', field: 'q1_people'});
      assert.deepEqual(props.x2, {scale: 'x', field: 'q3_people'});
    });
  });
});

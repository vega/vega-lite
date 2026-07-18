import {SignalRef} from 'vega';
import {COLOR, X, Y} from '../../../src/channel.js';
import {area} from '../../../src/compile/mark/area.js';
import {Encoding} from '../../../src/encoding.js';
import {NormalizedUnitSpec} from '../../../src/spec/index.js';
import {internalField} from '../../../src/util.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util.js';

describe('Mark: Area', () => {
  function verticalArea(moreEncoding: Encoding<string> = {}): NormalizedUnitSpec {
    return {
      mark: 'area',
      encoding: {
        x: {timeUnit: 'year', field: 'Year', type: 'temporal'},
        y: {aggregate: 'count', type: 'quantitative'},
        ...moreEncoding,
      },
      data: {url: 'data/cars.json'},
    };
  }

  describe('vertical area, with log', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {scale: {type: 'log'}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'},
      },
      data: {url: 'data/movies.json'},
    });
    const props = area.encodeEntry(model);

    it("should end on axis's min", () => {
      expect(props.y2).toEqual({signal: "scale('y', domain('y')[0])"});
    });

    it('should has no height', () => {
      expect(props.height).toBeUndefined();
    });
  });

  describe('stacked vertical area, with binned dimension', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'},
        color: {type: 'nominal', field: 'c'},
      },
      data: {url: 'data/movies.json'},
    });
    const props = area.encodeEntry(model);

    it('should use bin_mid for x', () => {
      expect(props.x).toEqual({field: 'bin_maxbins_10_IMDB_Rating_mid', scale: 'x'});
    });

    it('should use bin_mid for the defined check', () => {
      expect((props.defined as SignalRef).signal).toContain('bin_maxbins_10_IMDB_Rating_mid');
    });
  });

  describe('vertical area, with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {scale: {zero: false}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'},
      },
      data: {url: 'data/movies.json'},
    });
    const props = area.encodeEntry(model);

    it("should end on axis's min or zero", () => {
      expect(props.y2).toEqual({signal: `scale('y', inrange(0, domain('y')) ? 0 : domain('y')[0])`});
    });

    it('should has no height', () => {
      expect(props.height).toBeUndefined();
    });
  });

  describe('vertical area', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
    const props = area.encodeEntry(model);

    it('should have scale for x', () => {
      expect(props.x).toEqual({scale: X, field: 'year_Year'});
    });

    it('should have scale for y', () => {
      expect(props.y).toEqual({scale: Y, field: internalField('count')});
    });

    it('should have the correct value for y2', () => {
      expect(props.y2).toEqual({scale: 'y', value: 0});
    });
  });

  describe('vertical area with binned dimension', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
    const props = area.encodeEntry(model);

    it('should have scale for x', () => {
      expect(props.x).toEqual({scale: X, field: 'year_Year'});
    });

    it('should have scale for y', () => {
      expect(props.y).toEqual({scale: Y, field: internalField('count')});
    });

    it('should have the correct value for y2', () => {
      expect(props.y2).toEqual({scale: 'y', value: 0});
    });
  });

  describe('vertical area with size encoding for thickness', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {field: 'Year', type: 'temporal'},
        y: {field: 'Worldwide_Gross', type: 'quantitative'},
        size: {field: 'US_Gross', type: 'quantitative'},
      },
      data: {url: 'data/movies.json'},
    });
    const props = area.encodeEntry(model);

    it('should use y/y2 around the centerline based on size', () => {
      expect((props.y as any).scale).toBe('y');
      expect((props.y as any).offset).toEqual({scale: 'size', field: 'US_Gross', mult: 0.5});
      expect((props.y2 as any).scale).toBe('y');
      expect((props.y2 as any).offset).toEqual({scale: 'size', field: 'US_Gross', mult: -0.5});
    });

    it('should also support value centerlines', () => {
      const valueCenterModel = parseUnitModelWithScaleAndLayoutSize({
        mark: 'area',
        encoding: {
          x: {field: 'Year', type: 'temporal'},
          y: {value: 60},
          size: {field: 'US_Gross', type: 'quantitative'},
        },
        data: {url: 'data/movies.json'},
      });
      const valueCenterProps = area.encodeEntry(valueCenterModel);

      expect(valueCenterProps.y).toEqual({value: 60, offset: {scale: 'size', field: 'US_Gross', mult: 0.5}});
      expect(valueCenterProps.y2).toEqual({value: 60, offset: {scale: 'size', field: 'US_Gross', mult: -0.5}});
    });

    it('should preserve conditional size production rules for both edges', () => {
      const conditionalModel = parseUnitModelWithScaleAndLayoutSize({
        mark: 'area',
        encoding: {
          x: {field: 'Year', type: 'temporal'},
          y: {field: 'Worldwide_Gross', type: 'quantitative'},
          size: {
            condition: {test: 'datum.highlight', field: 'US_Gross', type: 'quantitative'},
            value: 10,
          },
        },
        data: {url: 'data/movies.json'},
      });
      const conditionalProps = area.encodeEntry(conditionalModel);

      expect(conditionalProps.y).toEqual([
        {
          test: 'datum.highlight',
          scale: 'y',
          field: 'Worldwide_Gross',
          offset: {scale: 'size', field: 'US_Gross', mult: 0.5},
        },
        {scale: 'y', field: 'Worldwide_Gross', offset: {value: 10, mult: 0.5}},
      ]);
      expect(conditionalProps.y2).toEqual([
        {
          test: 'datum.highlight',
          scale: 'y',
          field: 'Worldwide_Gross',
          offset: {scale: 'size', field: 'US_Gross', mult: -0.5},
        },
        {scale: 'y', field: 'Worldwide_Gross', offset: {value: 10, mult: -0.5}},
      ]);
    });
  });

  describe('horizontal area with size encoding for thickness', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {field: 'Species', type: 'nominal'},
        y: {field: 'value', type: 'quantitative'},
        size: {field: 'density', type: 'quantitative'},
      },
      data: {url: 'data/penguins.json'},
    });
    const props = area.encodeEntry(model);

    it('should use x/x2 around the centerline based on size', () => {
      expect((props.x as any).scale).toBe('x');
      expect((props.x as any).offset).toEqual({scale: 'size', field: 'density', mult: 0.5});
      expect((props.x2 as any).scale).toBe('x');
      expect((props.x2 as any).offset).toEqual({scale: 'size', field: 'density', mult: -0.5});
    });
  });

  describe('ranged area with size encoding', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {field: 'Year', type: 'temporal'},
        y: {field: 'low', type: 'quantitative'},
        y2: {field: 'high'},
        size: {field: 'uncertainty', type: 'quantitative'},
      },
    });
    const props = area.encodeEntry(model);

    it('should preserve the explicit range instead of using size as thickness', () => {
      expect(model.encoding.size).toBeUndefined();
      expect(props.y).toEqual({scale: 'y', field: 'low'});
      expect(props.y2).toEqual({scale: 'y', field: 'high'});
    });
  });

  describe('vertical stacked area with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      verticalArea({
        color: {field: 'Origin', type: 'quantitative'},
      }),
    );

    const props = area.encodeEntry(model);

    it('should have the correct value for y and y2', () => {
      expect(props.y).toEqual({scale: 'y', field: internalField('count_end')});
      expect(props.y2).toEqual({scale: 'y', field: internalField('count_start')});
    });

    it('should have correct orient', () => {
      expect(props.orient).toEqual({value: 'vertical'});
    });

    it('should have scale for color', () => {
      expect(props.fill).toEqual({scale: COLOR, field: 'Origin'});
    });
  });

  function horizontalArea(moreEncoding: Encoding<string> = {}): NormalizedUnitSpec {
    return {
      mark: 'area',
      encoding: {
        y: {timeUnit: 'year', field: 'Year', type: 'temporal'},
        x: {aggregate: 'count', type: 'quantitative'},
        ...moreEncoding,
      },
      data: {url: 'data/cars.json'},
    };
  }

  describe('horizontal area', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(horizontalArea());
    const props = area.encodeEntry(model);

    it('should have scale for y', () => {
      expect(props.y).toEqual({scale: Y, field: 'year_Year'});
    });

    it('should have scale for x', () => {
      expect(props.x).toEqual({scale: X, field: internalField('count')});
    });

    it('should have the correct value for x2', () => {
      expect(props.x2).toEqual({scale: 'x', value: 0});
    });
  });

  describe('horizontal area, with log', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        y: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        x: {scale: {type: 'log'}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'},
      },
      data: {url: 'data/movies.json'},
    });

    const props = area.encodeEntry(model);

    it("should end on axis's min", () => {
      expect(props.x2).toEqual({signal: `scale('x', domain('x')[0])`});
    });

    it('should have no width', () => {
      expect(props.width).toBeUndefined();
    });
  });

  describe('horizontal area, with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        y: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        x: {scale: {zero: false}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'},
      },
      data: {url: 'data/movies.json'},
    });

    const props = area.encodeEntry(model);

    it("should end on axis's min or zero", () => {
      expect(props.x2).toEqual({signal: "scale('x', inrange(0, domain('x')) ? 0 : domain('x')[0])"});
    });

    it('should have no width', () => {
      expect(props.width).toBeUndefined();
    });
  });

  describe('horizontal stacked area with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      horizontalArea({
        color: {field: 'Origin', type: 'nominal'},
      }),
    );

    const props = area.encodeEntry(model);

    it('should have the correct value for x and x2', () => {
      expect(props.x).toEqual({scale: 'x', field: internalField('count_end')});
      expect(props.x2).toEqual({scale: 'x', field: internalField('count_start')});
    });

    it('should have correct orient', () => {
      expect(props.orient).toEqual({value: 'horizontal'});
    });

    it('should have scale for color', () => {
      expect(props.fill).toEqual({scale: COLOR, field: 'Origin'});
    });
  });

  describe('ranged area', () => {
    it('vertical area should work with aggregate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'area',
        encoding: {
          x: {timeUnit: 'year', field: 'Year', type: 'temporal'},
          y: {aggregate: 'min', field: 'Weight_in_lbs', type: 'quantitative'},
          y2: {aggregate: 'max', field: 'Weight_in_lbs'},
        },
      });
      const props = area.encodeEntry(model);
      expect(props.x).toEqual({scale: 'x', field: 'year_Year'});
      expect(props.y).toEqual({scale: 'y', field: 'min_Weight_in_lbs'});
      expect(props.y2).toEqual({scale: 'y', field: 'max_Weight_in_lbs'});
    });

    it('horizontal area should work with aggregate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'area',
        encoding: {
          y: {timeUnit: 'year', field: 'Year', type: 'temporal'},
          x: {aggregate: 'min', field: 'Weight_in_lbs', type: 'quantitative'},
          x2: {aggregate: 'max', field: 'Weight_in_lbs'},
        },
      });
      const props = area.encodeEntry(model);
      expect(props.y).toEqual({scale: 'y', field: 'year_Year'});
      expect(props.x).toEqual({scale: 'x', field: 'min_Weight_in_lbs'});
      expect(props.x2).toEqual({scale: 'x', field: 'max_Weight_in_lbs'});
    });
  });
});

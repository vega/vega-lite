import {COLOR, X, Y} from '../../../src/channel';
import {area} from '../../../src/compile/mark/area';
import {Encoding} from '../../../src/encoding';
import {NormalizedUnitSpec} from '../../../src/spec';
import {internalField} from '../../../src/util';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Area', () => {
  function verticalArea(moreEncoding: Encoding<string> = {}): NormalizedUnitSpec {
    return {
      mark: 'area',
      encoding: {
        x: {timeUnit: 'year', field: 'Year', type: 'temporal'},
        y: {aggregate: 'count', type: 'quantitative'},
        ...moreEncoding
      },
      data: {url: 'data/cars.json'}
    };
  }

  describe('vertical area, with log', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {scale: {type: 'log'}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'}
      },
      data: {url: 'data/movies.json'}
    });
    const props = area.encodeEntry(model);

    it('should end on axis', () => {
      expect(props.y2).toEqual({field: {group: 'height'}});
    });

    it('should has no height', () => {
      expect(props.height).not.toBeDefined();
    });
  });

  describe('stacked vertical area, with binned dimension', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {type: 'quantitative', field: 'US_Gross', aggregate: 'sum'},
        color: {type: 'nominal', field: 'c'}
      },
      data: {url: 'data/movies.json'}
    });
    const props = area.encodeEntry(model);

    it('should use bin_mid for x', () => {
      expect(props.x).toEqual({field: 'bin_maxbins_10_IMDB_Rating_mid', scale: 'x'});
    });
  });

  describe('vertical area, with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        x: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        y: {scale: {zero: false}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'}
      },
      data: {url: 'data/movies.json'}
    });
    const props = area.encodeEntry(model);

    it('should end on axis', () => {
      expect(props.y2).toEqual({field: {group: 'height'}});
    });

    it('should has no height', () => {
      expect(props.height).not.toBeDefined();
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

  describe('vertical stacked area with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      verticalArea({
        color: {field: 'Origin', type: 'quantitative'}
      })
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
        ...moreEncoding
      },
      data: {url: 'data/cars.json'}
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
        x: {scale: {type: 'log'}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'}
      },
      data: {url: 'data/movies.json'}
    });

    const props = area.encodeEntry(model);

    it('should end on axis', () => {
      expect(props.x2).toEqual({value: 0});
    });

    it('should have no width', () => {
      expect(props.width).not.toBeDefined();
    });
  });

  describe('horizontal area, with zero=false', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'area',
      encoding: {
        y: {bin: true, type: 'quantitative', field: 'IMDB_Rating'},
        x: {scale: {zero: false}, type: 'quantitative', field: 'US_Gross', aggregate: 'mean'}
      },
      data: {url: 'data/movies.json'}
    });

    const props = area.encodeEntry(model);

    it('should end on axis', () => {
      expect(props.x2).toEqual({value: 0});
    });

    it('should have no width', () => {
      expect(props.width).not.toBeDefined();
    });
  });

  describe('horizontal stacked area with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(
      horizontalArea({
        color: {field: 'Origin', type: 'nominal'}
      })
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
          y2: {aggregate: 'max', field: 'Weight_in_lbs'}
        }
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
          x2: {aggregate: 'max', field: 'Weight_in_lbs'}
        }
      });
      const props = area.encodeEntry(model);
      expect(props.y).toEqual({scale: 'y', field: 'year_Year'});
      expect(props.x).toEqual({scale: 'x', field: 'min_Weight_in_lbs'});
      expect(props.x2).toEqual({scale: 'x', field: 'max_Weight_in_lbs'});
    });
  });
});

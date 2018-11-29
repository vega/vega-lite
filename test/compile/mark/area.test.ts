/* tslint:disable quotemark */

import {assert} from 'chai';
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
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', () => {
      assert.isUndefined(props.height);
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
      assert.deepEqual(props.x, {field: 'bin_maxbins_10_IMDB_Rating_mid', scale: 'x'});
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
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', () => {
      assert.isUndefined(props.height);
    });
  });

  describe('vertical area', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
    const props = area.encodeEntry(model);

    it('should have scale for x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'year_Year'});
    });

    it('should have scale for y', () => {
      assert.deepEqual(props.y, {scale: Y, field: internalField('count')});
    });

    it('should have the correct value for y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
    });
  });

  describe('vertical area with binned dimension', () => {
    const model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
    const props = area.encodeEntry(model);

    it('should have scale for x', () => {
      assert.deepEqual(props.x, {scale: X, field: 'year_Year'});
    });

    it('should have scale for y', () => {
      assert.deepEqual(props.y, {scale: Y, field: internalField('count')});
    });

    it('should have the correct value for y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
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
      assert.deepEqual(props.y, {scale: 'y', field: internalField('count_end')});
      assert.deepEqual(props.y2, {scale: 'y', field: internalField('count_start')});
    });

    it('should have correct orient', () => {
      assert.deepEqual(props.orient, {value: 'vertical'});
    });

    it('should have scale for color', () => {
      assert.deepEqual(props.fill, {scale: COLOR, field: 'Origin'});
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
      assert.deepEqual(props.y, {scale: Y, field: 'year_Year'});
    });

    it('should have scale for x', () => {
      assert.deepEqual(props.x, {scale: X, field: internalField('count')});
    });

    it('should have the correct value for x2', () => {
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
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
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', () => {
      assert.isUndefined(props.width);
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
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', () => {
      assert.isUndefined(props.width);
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
      assert.deepEqual(props.x, {scale: 'x', field: internalField('count_end')});
      assert.deepEqual(props.x2, {scale: 'x', field: internalField('count_start')});
    });

    it('should have correct orient', () => {
      assert.deepEqual(props.orient, {value: 'horizontal'});
    });

    it('should have scale for color', () => {
      assert.deepEqual(props.fill, {scale: COLOR, field: 'Origin'});
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
          y2: {aggregate: 'max', field: 'Weight_in_lbs', type: 'quantitative'}
        }
      });
      const props = area.encodeEntry(model);
      assert.deepEqual(props.x, {scale: 'x', field: 'year_Year'});
      assert.deepEqual(props.y, {scale: 'y', field: 'min_Weight_in_lbs'});
      assert.deepEqual(props.y2, {scale: 'y', field: 'max_Weight_in_lbs'});
    });

    it('horizontal area should work with aggregate', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {url: 'data/cars.json'},
        mark: 'area',
        encoding: {
          y: {timeUnit: 'year', field: 'Year', type: 'temporal'},
          x: {aggregate: 'min', field: 'Weight_in_lbs', type: 'quantitative'},
          x2: {aggregate: 'max', field: 'Weight_in_lbs', type: 'quantitative'}
        }
      });
      const props = area.encodeEntry(model);
      assert.deepEqual(props.y, {scale: 'y', field: 'year_Year'});
      assert.deepEqual(props.x, {scale: 'x', field: 'min_Weight_in_lbs'});
      assert.deepEqual(props.x2, {scale: 'x', field: 'max_Weight_in_lbs'});
    });
  });
});

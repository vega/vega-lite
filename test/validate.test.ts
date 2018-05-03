import {assert} from 'chai';
import {AREA, BAR, LINE, TEXT} from '../src/mark';
import {getEncodingMappingError} from '../src/validate';

describe('vl.validate', () =>  {
  describe('getEncodingMappingError()', () =>  {
    it('should return no error for valid specs', () =>  {
      assert.isNull(getEncodingMappingError({
        mark: BAR,
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      }));

      assert.isNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          x: {field: 'b', type: 'quantitative'},
          y: {field: 'a', type: 'quantitative'}
        }
      }));

      assert.isNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'}
        }
      }));
    });

    it('should return error for invalid specs', () =>  {
      assert.isNotNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          x: {field: 'b', type: 'quantitative'} // missing y
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          y: {field: 'b', type: 'quantitative'} // missing x
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: TEXT,
        encoding: {
          y: {field: 'b', type: 'quantitative'} // missing text
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          shape: {field: 'b', type: 'quantitative'} // using shape with line
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          shape: {field: 'b', type: 'quantitative'} // using shape with area
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: BAR,
        encoding: {
          shape: {field: 'b', type: 'quantitative'} // using shape with bar
        }
      }));
    });
  });
});

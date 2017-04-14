import {assert} from 'chai';
import {AREA, BAR, LINE, TEXT} from '../src/mark';
import {getEncodingMappingError} from '../src/validate';

describe('vl.validate', function() {
  describe('getEncodingMappingError()', function () {
    it('should return no error for valid specs', function() {
      assert.isNull(getEncodingMappingError({
        mark: BAR,
        encoding: {
          x: {field: 'a'}
        }
      }));

      assert.isNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          x: {field: 'b'},
          y: {field: 'a'}
        }
      }));

      assert.isNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          x: {field: 'a'},
          y: {field: 'b'}
        }
      }));
    });

    it('should return error for invalid specs', function() {
      assert.isNotNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          x: {field: 'b'} // missing y
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          y: {field: 'b'} // missing x
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: TEXT,
        encoding: {
          y: {field: 'b'} // missing text
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: LINE,
        encoding: {
          shape: {field: 'b'} // using shape with line
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: AREA,
        encoding: {
          shape: {field: 'b'} // using shape with area
        }
      }));

      assert.isNotNull(getEncodingMappingError({
        mark: BAR,
        encoding: {
          shape: {field: 'b'} // using shape with bar
        }
      }));
    });
  });
});

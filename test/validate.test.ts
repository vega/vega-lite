import {AREA, BAR, LINE, TEXT} from '../src/mark';
import {getEncodingMappingError} from '../src/validate';

describe('vl.validate', () => {
  describe('getEncodingMappingError()', () => {
    it('should return no error for valid specs', () => {
      expect(
        getEncodingMappingError({
          mark: BAR,
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        })
      ).toBeNull();

      expect(
        getEncodingMappingError({
          mark: LINE,
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'a', type: 'quantitative'}
          }
        })
      ).toBeNull();

      expect(
        getEncodingMappingError({
          mark: AREA,
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            y: {field: 'b', type: 'quantitative'}
          }
        })
      ).toBeNull();
    });

    it('should return error for invalid specs', () => {
      expect(
        getEncodingMappingError({
          mark: LINE,
          encoding: {
            x: {field: 'b', type: 'quantitative'} // missing y
          }
        })
      ).not.toBeNull();

      expect(
        getEncodingMappingError({
          mark: AREA,
          encoding: {
            y: {field: 'b', type: 'quantitative'} // missing x
          }
        })
      ).not.toBeNull();

      expect(
        getEncodingMappingError({
          mark: TEXT,
          encoding: {
            y: {field: 'b', type: 'quantitative'} // missing text
          }
        })
      ).not.toBeNull();

      expect(
        getEncodingMappingError({
          mark: LINE,
          encoding: {
            shape: {field: 'b', type: 'nominal'} // using shape with line
          }
        })
      ).not.toBeNull();

      expect(
        getEncodingMappingError({
          mark: AREA,
          encoding: {
            shape: {field: 'b', type: 'nominal'} // using shape with area
          }
        })
      ).not.toBeNull();

      expect(
        getEncodingMappingError({
          mark: BAR,
          encoding: {
            shape: {field: 'b', type: 'nominal'} // using shape with bar
          }
        })
      ).not.toBeNull();
    });
  });
});

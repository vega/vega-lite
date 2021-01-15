import * as log from '../../src/log';
import {replaceRepeaterInEncoding, replaceRepeaterInFacet} from '../../src/normalize/repeater';

describe('Repeat', () => {
  describe('replaceRepeaterInEncoding', () => {
    it('should resolve repeated fields', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          x: {field: {repeat: 'row'}, type: 'quantitative'},
          y: {field: 'bar', type: 'quantitative'}
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        x: {field: 'foo', type: 'quantitative'},
        y: {field: 'bar', type: 'quantitative'}
      });
    });

    it('should resolve repeated datums', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          x: {datum: {repeat: 'row'}, type: 'quantitative'},
          y: {field: 'bar', type: 'quantitative'}
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        x: {datum: 'foo', type: 'quantitative'},
        y: {field: 'bar', type: 'quantitative'}
      });
    });

    it(
      'should show warning if repeat in field def cannot be resolved',
      log.wrap(localLogger => {
        const resolved = replaceRepeaterInEncoding(
          {
            x: {field: {repeat: 'row'}, type: 'quantitative'},
            y: {field: 'bar', type: 'quantitative'}
          },
          {column: 'foo'}
        );

        expect(localLogger.warns[0]).toEqual(log.message.noSuchRepeatedValue('row'));
        expect(resolved).toEqual({
          y: {field: 'bar', type: 'quantitative'}
        });
      })
    );

    it('should support arrays fo field defs', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          detail: [
            {field: {repeat: 'row'}, type: 'quantitative'},
            {field: 'bar', type: 'quantitative'}
          ]
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        detail: [
          {field: 'foo', type: 'quantitative'},
          {field: 'bar', type: 'quantitative'}
        ]
      });
    });

    it('should replace fields in sort', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          x: {field: 'bar', type: 'quantitative', sort: {field: {repeat: 'row'}, op: 'min'}}
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        x: {field: 'bar', type: 'quantitative', sort: {field: 'foo', op: 'min'}}
      });
    });

    it('should replace fields in conditionals', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          color: {
            condition: {param: 'test', field: {repeat: 'row'}, type: 'quantitative'},
            value: 'red'
          }
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        color: {
          condition: {param: 'test', field: 'foo', type: 'quantitative'},
          value: 'red'
        }
      });
    });

    it('should replace fields in reveresed conditionals', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          color: {
            condition: {param: 'test', value: 'red'},
            field: {repeat: 'row'},
            type: 'quantitative'
          }
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        color: {
          condition: {param: 'test', value: 'red'},
          field: 'foo',
          type: 'quantitative'
        }
      });
    });

    it(
      'should show warning if repeat in conditional cannot be resolved',
      log.wrap(localLogger => {
        const resolved = replaceRepeaterInEncoding(
          {
            color: {
              condition: {param: 'test', field: {repeat: 'row'}, type: 'quantitative'},
              value: 'red'
            }
          },
          {column: 'foo'}
        );

        expect(localLogger.warns[0]).toEqual(log.message.noSuchRepeatedValue('row'));
        expect(resolved).toEqual({
          color: {value: 'red'}
        });
      })
    );

    it(
      'should show warning if repeat in a condition field def cannot be resolved',
      log.wrap(localLogger => {
        const resolved = replaceRepeaterInEncoding(
          {
            color: {
              condition: {param: 'test', value: 'red'},
              field: {repeat: 'row'},
              type: 'quantitative'
            }
          },
          {column: 'foo'}
        );

        expect(localLogger.warns[0]).toEqual(log.message.noSuchRepeatedValue('row'));
        expect(resolved).toEqual({
          color: {
            condition: {param: 'test', value: 'red'}
          }
        });
      })
    );
  });

  describe('replaceRepeaterInFacet', () => {
    it('should resolve repeated fields', () => {
      const resolved = replaceRepeaterInFacet(
        {
          row: {field: {repeat: 'row'}, type: 'quantitative'},
          column: {field: 'bar', type: 'quantitative'}
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        row: {field: 'foo', type: 'quantitative'},
        column: {field: 'bar', type: 'quantitative'}
      });
    });
  });
});

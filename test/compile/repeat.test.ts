import {replaceRepeaterInEncoding} from '../../src/compile/repeater';
import * as log from '../../src/log';
import {keys} from '../../src/util';
import {parseRepeatModel} from '../util';

describe('Repeat', () => {
  describe('resolveRepeat', () => {
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
          detail: [{field: {repeat: 'row'}, type: 'quantitative'}, {field: 'bar', type: 'quantitative'}]
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        detail: [{field: 'foo', type: 'quantitative'}, {field: 'bar', type: 'quantitative'}]
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
            condition: {selection: 'test', field: {repeat: 'row'}, type: 'quantitative'},
            value: 'red'
          }
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        color: {
          condition: {selection: 'test', field: 'foo', type: 'quantitative'},
          value: 'red'
        }
      });
    });

    it('should replace fields in reveresed conditionals', () => {
      const resolved = replaceRepeaterInEncoding(
        {
          color: {
            condition: {selection: 'test', value: 'red'},
            field: {repeat: 'row'},
            type: 'quantitative'
          }
        },
        {row: 'foo'}
      );

      expect(resolved).toEqual({
        color: {
          condition: {selection: 'test', value: 'red'},
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
              condition: {selection: 'test', field: {repeat: 'row'}, type: 'quantitative'},
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
              condition: {selection: 'test', value: 'red'},
              field: {repeat: 'row'},
              type: 'quantitative'
            }
          },
          {column: 'foo'}
        );

        expect(localLogger.warns[0]).toEqual(log.message.noSuchRepeatedValue('row'));
        expect(resolved).toEqual({
          color: {
            condition: {selection: 'test', value: 'red'}
          }
        });
      })
    );
  });

  describe('initialize children', () => {
    it('should create a model per repeated value', () => {
      const model = parseRepeatModel({
        repeat: {
          row: ['Acceleration', 'Horsepower']
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: {repeat: 'row'}, type: 'quantitative'}
          }
        }
      });

      expect(model.children).toHaveLength(2);
    });

    it('should create n*m models if row and column are specified', () => {
      const model = parseRepeatModel({
        repeat: {
          row: ['Acceleration', 'Horsepower', 'Displacement'],
          column: ['Origin', 'NumCylinders']
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: {repeat: 'row'}, type: 'quantitative'},
            y: {field: {repeat: 'column'}, type: 'ordinal'}
          }
        }
      });

      expect(model.children).toHaveLength(6);
    });

    it('should union color scales and legends', () => {
      const model = parseRepeatModel({
        repeat: {
          row: ['foo', 'bar'],
          column: ['foo', 'bar']
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: {repeat: 'row'}, type: 'quantitative'},
            y: {field: {repeat: 'column'}, type: 'ordinal'},
            color: {field: 'baz', type: 'nominal'}
          }
        }
      });

      model.parseScale();
      const colorScale = model.component.scales['color'];

      expect(colorScale.domains).toHaveLength(4);

      model.parseLegend();

      expect(keys(model.component.legends)).toHaveLength(1);
    });
  });

  describe('resolve', () => {
    it(
      'cannot share axes',
      log.wrap(localLogger => {
        parseRepeatModel({
          repeat: {},
          spec: {
            mark: 'point',
            encoding: {}
          },
          resolve: {
            axis: {
              x: 'shared'
            }
          }
        });
        expect(localLogger.warns[0]).toEqual(log.message.REPEAT_CANNOT_SHARE_AXIS);
      })
    );
  });
});

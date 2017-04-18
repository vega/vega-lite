import {assert} from 'chai';
import {replaceRepeaterInEncoding} from '../../src/compile/repeat';
import * as log from '../../src/log';
import {keys} from '../../src/util';
import {DataRefUnionDomain, isDataRefUnionedDomain} from '../../src/vega.schema';
import {parseRepeatModel} from '../util';

describe('Repeat', function() {
  describe('resolveRepeat', () => {
    it('should resolve repeated fields', () => {
      const resolved = replaceRepeaterInEncoding({
        x: {field: {repeat: 'row'}},
        y: {field: 'bar'}
      }, {row: 'foo'});

      assert.deepEqual(resolved, {
        x: {field: 'foo'},
        y: {field: 'bar'}
      });
    });

    it('should show warning if repeat cannot be resolved', () => {
      log.runLocalLogger((localLogger) => {
        const resolved = replaceRepeaterInEncoding({
          x: {field: {repeat: 'row'}},
          y: {field: 'bar'}
        }, {column: 'foo'});

        assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
      });
    });

    it('should support arrays fo field defs', () => {
      const resolved = replaceRepeaterInEncoding({
        detail: [{field: {repeat: 'row'}}, {field: 'bar'}]
      }, {row: 'foo'});

      assert.deepEqual(resolved, {
        detail: [{field: 'foo'}, {field: 'bar'}]
      });
    });
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

      assert.equal(model.children.length, 2);
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

      assert.equal(model.children.length, 6);
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

      assert(isDataRefUnionedDomain(colorScale.domain));
      assert.deepEqual((colorScale.domain as DataRefUnionDomain).fields.length, 4);

      model.parseLegend();

      assert.equal(keys(model.component.legends).length, 1);
    });
  });
});

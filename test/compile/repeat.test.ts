import {assert} from 'chai';
import {replaceRepeaterInEncoding} from '../../src/compile/repeat';
import * as log from '../../src/log';
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
  });
});

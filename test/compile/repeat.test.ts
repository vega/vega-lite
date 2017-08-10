import {assert} from 'chai';

import {replaceRepeaterInEncoding} from '../../src/compile/repeater';
import {Encoding} from '../../src/encoding';
import * as log from '../../src/log';
import {keys} from '../../src/util';
import {parseRepeatModel} from '../util';

describe('Repeat', function() {
  describe('assembleScales', () => {
    it('includes all scales', () => {
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

      model.parseScale();
      const scales = model.assembleScales();
      assert.equal(scales.length, 2);
    });
  });

  describe('resolveRepeat', () => {
    it('should resolve repeated fields', () => {
      const resolved = replaceRepeaterInEncoding({
        x: {field: {repeat: 'row'}, type: 'quantitative'},
        y: {field: 'bar', type: 'quantitative'}
      }, {row: 'foo'});

      assert.deepEqual<Encoding<string>>(resolved, {
        x: {field: 'foo', type: 'quantitative'},
        y: {field: 'bar', type: 'quantitative'}
      });
    });

    it('should show warning if repeat cannot be resolved', () => {
      log.runLocalLogger((localLogger) => {
        const resolved = replaceRepeaterInEncoding({
          x: {field: {repeat: 'row'}, type: 'quantitative'},
          y: {field: 'bar', type: 'quantitative'}
        }, {column: 'foo'});

        assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
      });
    });

    it('should support arrays fo field defs', () => {
      const resolved = replaceRepeaterInEncoding({
        detail: [
          {field: {repeat: 'row'}, type: 'quantitative'},
          {field: 'bar', type: 'quantitative'}
        ]
      }, {row: 'foo'});

      assert.deepEqual<Encoding<string>>(resolved, {
        detail: [{field: 'foo', type: 'quantitative'}, {field: 'bar', type: 'quantitative'}]
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

      assert.deepEqual(colorScale.domains.length, 4);

      model.parseLegend();

      assert.equal(keys(model.component.legends).length, 1);
    });
  });
});
